# 视频优化笔记

## 问题：视频要完全下载才能播放

页面里的 `<video>` 必须等整个 mp4 文件下载完才显示/可播放，体验很差。根本原因是 mp4 文件的 `moov` atom（包含时长、关键帧索引等元数据）位于文件**末尾**。浏览器拿不到 `moov` 就无法开始解码，于是只能把整个文件下完。

## 解决方案：HTTP Range + 流式播放（faststart）

### 1. 用 ffmpeg 把 moov atom 移到文件开头

```bash
ffmpeg -i input.mp4 -c copy -movflags +faststart output.mp4
```

- `-c copy` 不重新编码，无损、秒级处理
- `+faststart` 在封装阶段把 moov 前置

处理后浏览器只要下载文件开头一小段就能开始播放，配合服务器的 HTTP Range 请求即可拖拽进度条。

### 2. 批量处理 public/de 下所有视频

```bash
cd public/de
for f in *.mp4; do
  ffmpeg -y -i "$f" -c copy -movflags +faststart "_fast_$f" \
    && mv "_fast_$f" "$f"
done
```

执行前先备份。脚本会原地替换所有 mp4。

### 3. 验证

用 `ffprobe` 或 `mp4info` 看 atom 顺序：

```bash
ffmpeg -v trace -i output.mp4 2>&1 | grep -E 'type:(moov|mdat)'
```

正常顺序应该是 `moov` 在 `mdat` 之前。

## 已经做的优化

- 在所有 mdx 的 `<video>` 标签加了 `preload="metadata"`，避免页面加载时预拉整段视频
- 默认 Next.js 在 `public/` 下的静态文件由 Node 服务直接 serve，已经支持 Range 请求

## 后续可考虑

- **封面图 `poster`**：视频未播放前显示缩略图，避免空白
  ```bash
  ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 cover.jpg
  ```
  ```html
  <video controls preload="metadata" poster="/de/L0.jpg">
  ```
- **降低码率/分辨率**：屏幕录制类内容 720p + 1Mbps 已足够清晰
  ```bash
  ffmpeg -i input.mp4 -vf scale=-2:720 -c:v libx264 -crf 23 -preset medium -movflags +faststart output.mp4
  ```
- **转 HLS**：超大视频（>100MB）切片成 m3u8，浏览器按需加载片段
  ```bash
  ffmpeg -i input.mp4 -c copy -hls_time 10 -hls_list_size 0 -f hls out.m3u8
  ```
  播放需要 hls.js 之类的库
- **CDN 托管**：Cloudflare Stream、Bunny Stream、阿里云点播等，自动转码 + 全球加速

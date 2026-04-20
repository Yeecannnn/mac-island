# MacDynamicIsland

基于 `boring.notch` 的闭合尺寸思路与 `claude-island` 的状态驱动内容区思路，重做的 macOS 灵动岛原型。

当前实现：
<img width="3002" height="2002" alt="image" src="https://github.com/user-attachments/assets/e5ac1626-a137-4471-82a0-fabf7e23d93d" />
<img width="3000" height="2002" alt="image" src="https://github.com/user-attachments/assets/be55dbf6-c64d-4fe9-9ba2-a595a29d2149" />
<img width="3002" height="2002" alt="image" src="https://github.com/user-attachments/assets/0b8523f7-cbd0-440c-ab41-59ac81bd360a" />

- 顶部居中悬浮，闭合尺寸优先贴近实体刘海
- 模块化展开面板：`Media`、`Calendar`、`Shelf`、`AI`、`Timer`、`Reminders`
- 媒体播放控制：优先尝试控制 `Spotify` / `Music`
- 日历聚合：读取接下来 18 小时的事件
- 临时文件中转站：监听剪贴板，把文本和图片落到 `/tmp/MacDynamicIslandShelf`
- AI 对话：支持 OpenAI 兼容接口
- 计时器：支持常用专注时长和完成通知
- 定时提醒：喝水 / 站立两类循环通知

## 运行方式
-终端进入文件夹后
输入 “./run.sh” 打开程序后，点击刘海按钮即可打开灵动岛
```bash
swift run
```

## 打包下载版

项目内置了一个无需 Xcode 工程的打包脚本，可直接生成 `.app`、`.zip`、`.dmg`：

```bash
chmod +x ./scripts/package_app.sh
./scripts/package_app.sh
```

打包完成后，产物位于 `dist/`：

- `dist/MacIsland.app`
- `dist/MacIsland.zip`
- `dist/MacIsland.dmg`

## AI 配置

应用内可直接填写并保存以下配置：

- `Endpoint`
- `Model`
- `API key`

也支持启动前通过环境变量注入：

```bash
OPENAI_API_KEY=... OPENAI_MODEL=gpt-4.1-mini swift run
```

## 注意

- 媒体控制当前通过 AppleScript 做 `Music` / `Spotify` 的 best-effort 控制
- 日历和通知首次运行会请求系统权限
- 当前机器如果没有切到完整 Xcode，`xcodebuild` 不可用，但 Swift Package 形式仍可继续开发

# Mac Island Demo 操作文档

## 在线演示
打开首页后，点击顶部的黑色灵动岛即可展开并切换模块：

- 概览
- AI
- 中转站
- 计时器
- 提醒

## 下载源码
点击页面顶部的“下载源码压缩包”按钮，或直接访问：

https://github.com/Yeecannnn/mac-island/archive/refs/heads/main.zip

## 查看仓库
GitHub 仓库地址：

https://github.com/Yeecannnn/mac-island

## 本地运行原生程序
```bash
cd /Users/coleyip/Desktop/dev/projects/island
./run.sh
```

## 本地运行网页 Demo
```bash
cd /Users/coleyip/Desktop/dev/projects/island/web-demo
python3 -m http.server 4173
```

然后在浏览器打开：

http://localhost:4173

## AI 配置说明
- 接口地址可留空
- 留空时默认使用 OpenAI 官方地址
- 如果你使用第三方模型厂商，通常仍需填写对方提供的 Base URL
- 模型栏填写模型名或对应的 Endpoint ID

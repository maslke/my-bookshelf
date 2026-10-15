# 我的书架

Android 个人藏书管理应用的介绍页面与安装包发布仓库。

- 介绍页：https://maslke.github.io/my-bookshelf/
- 安装包：https://github.com/maslke/my-bookshelf/releases

## GitHub Pages

将本仓库推送到 GitHub 后，在 **Settings → Pages** 中配置：

- Source：**Deploy from a branch**
- Branch：**main**
- Folder：**/(root)**

部署完成后，页面地址为 `https://maslke.github.io/my-bookshelf/index.html`。
以 GitHub Pages 设置页实际提供的地址为准。无需再创建同名子目录。

页面文件为 `index.html`、`styles.css`、`theme.js` 和 `assets/`，无需构建工具。
`.nojekyll` 用于直接发布静态文件。主题切换及页面资源均使用相对路径。

## 安装包

在本仓库的 Releases 中上传已签名 APK，并发布 Release，访客即可通过介绍页的下载入口访问。
仅发布介绍页不会自动生成或上传安装包。面向公众下载时，本仓库及 Release 应公开可访问。

本仓库仅包含公开发布文件，不包含 Android 应用源码或签名密钥。

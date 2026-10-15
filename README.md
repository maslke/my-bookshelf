# 我的书架

Android 个人藏书管理应用的介绍页面与安装包发布仓库。

- 介绍页：https://maslke.github.io/my-bookshelf/
- 安装包：https://github.com/maslke/my-bookshelf/releases

## 自动同步与 GitHub Pages 发布

[Sync and deploy bookshelf pages](https://github.com/maslke/my-bookshelf/actions/workflows/sync-pages.yml) 工作流从私有仓库 `maslke/bookshelf-app` 的 `main` 分支读取页面，并直接部署 GitHub Pages。

触发方式：

- 每小时第 17 分钟定时同步（UTC 时间；北京时间同样为每小时第 17 分钟）。GitHub 定时任务可能延迟，仓库长期不活跃时也可能被平台停用。
- 在 **Actions → Sync and deploy bookshelf pages → Run workflow** 手动运行，选择 `main` 分支。
- 本仓库 `main` 分支中的该工作流文件更新时运行。

源仓库页面更新需先提交并推送到 `bookshelf-app/main`，再等待定时同步或手动运行工作流。仅修改本机文件不会更新远程页面。

### 首次配置

1. 创建 [Fine-grained personal access token](https://github.com/settings/personal-access-tokens/new)：
   - Resource owner：`maslke`。
   - Repository access：**Only select repositories**，仅选择 **`bookshelf-app`**。
   - Repository permissions：**Contents → Read-only**，其余保留默认权限。
   - 设置适合的有效期；Token 过期后需更新下面的 Secret。
2. 打开 **my-bookshelf 仓库**的 **Settings → Secrets and variables → Actions → New repository secret**：
   - Name：**`BOOKSHELF_SOURCE_TOKEN`**。
   - Secret：上一步生成的 Token。
3. 打开 **my-bookshelf 仓库 → Settings → Pages**，将 **Source** 改为 **GitHub Actions**。
4. 在 Actions 页手动运行工作流。首次运行或凭据缺失时，日志会明确指出需要配置的 Secret。

默认 `GITHUB_TOKEN` 只能访问当前仓库，无法读取另一个私有仓库，所以需要单独的只读 Token。Token 只需在 GitHub 的 Secret 输入框中保存，无需放进页面、工作流文件或提交记录。

### 同步范围

工作流仅检出 `docs/` 和 `scripts/build-site.py`，调用源仓库的构建脚本：

```bash
python3 source/scripts/build-site.py --output-dir "$RUNNER_TEMP/bookshelf-site" --no-readme
```

只有导出的 `index.html`、`styles.css`、`theme.js`、`.nojekyll` 和 `assets/` 上传为 Pages 产物，私有源码检出目录不会发布。流程不回写本仓库的 `main` 分支，也不产生自动同步提交；根目录中的静态文件保留为手动导出的快照，线上页面以最近一次成功的 Action 部署为准。

部署完成后，页面地址为 `https://maslke.github.io/my-bookshelf/index.html`，以 Pages 设置页提供的地址为准。无需创建同名子目录，也无需前端构建工具。主题切换及页面资源均使用相对路径。

配置参考：[私有仓库检出](https://github.com/actions/checkout#checkout-multiple-repos-private)、[Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[Actions Secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)。

## 安装包

在本仓库的 Releases 中上传已签名 APK，并发布 Release，访客即可通过介绍页的下载入口访问。
仅发布介绍页不会自动生成或上传安装包。面向公众下载时，本仓库及 Release 应公开可访问。

本仓库仅包含公开发布文件，不包含 Android 应用源码或签名密钥。

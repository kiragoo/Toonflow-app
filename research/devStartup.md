# 本地开发环境启动

## 准备

- 使用 Bun 1.4.3（与根目录 `package.json` 的 `packageManager` 一致）。
- 在仓库根目录执行 `bun install --frozen-lockfile`。
- 开发服务会写入配置、初始化插件和 MCP 运行信息。建议给服务端指定独立数据目录，避免使用已有用户数据。`work/` 已被 Git 忽略。

本次 Windows 环境没有全局 Bun，使用 `npm install --prefix .\work\bunRuntime bun@1.4.3 --no-save --no-package-lock` 将其装入忽略目录。此时将下文命令中的 `bun` 换成 `& .\work\bunRuntime\node_modules\bun\bin\bun.exe` 即可；已有全局 Bun 时无需这一步。

## 分别启动服务端与前端

在仓库根目录打开两个 PowerShell 终端。

服务端终端：

```powershell
$env:TOONFLOW_DATA_DIR = Join-Path (Get-Location) "work/devData"
bun run dev:server
```

前端终端：

```powershell
bun run --cwd apps/web dev --host 127.0.0.1
```

在浏览器访问 `http://127.0.0.1:5173/`。服务端默认监听 `3000` 端口，Vite 将 `/api`、`/mcp`、`/a2a` 代理到 `http://127.0.0.1:3000`。端口可通过 `TOONFLOW_SERVER_PORT` 调整，但前后端必须使用相同值。两个终端分别按 `Ctrl+C` 停止。

服务端开发模式直接运行 `apps/server/src/index.ts`，不需要预先构建 Web。此时直接访问服务端根路径可能返回 404，应通过 Vite 地址打开页面。Bun 的 `--watch` 对 `apps/server` 目录以外的工作区源码会提示未监视；修改这些包后需要手动重启服务端。

## 节点插件构建与加载

前端和服务端启动成功，不代表内置节点已安装。服务端从 `build/nodes` 初始化节点到实际数据目录的 `nodes/`，`GET /api/nodes/get` 列出的也是数据目录中的插件，而不是 `packages/nodes` 源码。

2026-11-18 已核对本机存在以下构建产物，并在 `work/devData/nodes/` 中存在对应安装文件：

| 节点 | 构建产物 |
| --- | --- |
| 文本 | `build/nodes/textNode.umd.js` |
| 图片 | `build/nodes/imageNode.umd.js` |
| 图片生成 | `build/nodes/imageGenerationNode.umd.js` |

`work/devData/nodes/initialized` 也已存在。以上为文件状态核对，不代表全部节点已构建，也不代表模型调用、图片生成或所有节点交互已通过功能验证。

需要重新生成这三个节点时，可在仓库根目录单独执行各包现有的构建命令，无需清空整个节点构建目录：

```powershell
bun run --cwd packages/nodes/textNode build
bun run --cwd packages/nodes/imageNode build
bun run --cwd packages/nodes/imageGenerationNode build
```

### 独立数据目录的同步注意事项

- 独立 server 启动入口将 `build/nodes` 作为内置节点来源。首次初始化会复制匹配的 `.umd.js` 文件到 `TOONFLOW_DATA_DIR/nodes`。
- 当前独立 server 未向初始化函数传入构建版本；当目标目录已有 `initialized` 标记时，重启会跳过初始化。因此重新构建后，仅重启服务端不能保证已安装节点更新。
- 节点脚手架在 `NODE_ENV=dev`、watch 或 development mode 下会同步到仓库固定的 `data/nodes`，目前并不读取 `TOONFLOW_DATA_DIR`。本机服务使用 `work/devData`，不能把 `data/nodes` 更新当作该服务已加载新版插件。
- 使用已有开发数据目录时，需要将本次目标构建产物同步到该目录的 `nodes/`；保留其他插件、禁用标记、配置及数据库。不要为刷新节点清空数据目录。若后续实现自动同步，磁盘操作统一使用 `@toonflow/file`。
- 同步后刷新前端，在节点管理或画布节点入口核对列表。需要进一步排查时检查 `GET /api/nodes/get` 的 `enabled`、`loadError` 和文件加载情况；接口返回列表不等于节点执行成功。

相关实现：[服务端入口](../apps/server/src/index.ts)、[插件初始化](../apps/server/src/utils/plugins/initialize.ts)、[节点脚手架](../packages/nodeScaffold/index.ts)、[节点列表接口](../apps/server/src/routes/nodes/get.ts)。本节仅沉淀构建产物、加载路径及当前限制，未修改这些业务实现。

## 本地多租户体验

设置中的“多租户能力”已仅在 Vite 开发模式恢复配置面板，生产构建仍显示“正在开发”。首次初始化与普通用户注册使用本部署的用户名、密码，不使用 Toonflow 云账号或短信验证码。

先在仓库根目录执行一次前端构建：

```powershell
bun run --cwd apps/web build
```

`10888` 创作端由服务端提供 `build/web` 静态文件，不经过 Vite。修改普通用户页面后需要重新构建；`5173` 的管理后台仍由 Vite 热更新。

体验步骤：

1. 保持上述服务端与前端进程运行，打开 `http://127.0.0.1:5173/`。首次引导可点击“稍后配置”进入创作界面。
2. 打开“设置 → 多租户能力”，自行填写超级管理员账号、密码及确认密码，打开“开启多租户”，点击“保存”。账号为 1–64 字符且不能含空白，密码为 8–128 字符；没有预设账号或默认密码。
3. 打开 `http://127.0.0.1:5173/#/multiTenant`，使用刚设置的管理员账号登录。也可使用配置面板的“进入超管后台”。开启后刷新 `5173` 会进入后台。
4. 在后台“平台设置 → 系统配置”确认“允许注册”开启。用另一个浏览器或无痕窗口打开 `http://127.0.0.1:10888/`，注册普通账号；注册成功会进入创作界面。退出后再用相同账号密码登录，即可体验完整流程。
5. 后台“用户管理”可查看新注册的账号，也可由管理员新增普通账号。修改模型供应商、模型路由与价格后，普通用户才能使用对应模型；注册登录不要求先配置模型。

管理员后台与用户创作端分别使用管理会话和创作会话。普通用户无法访问后台；不要把 `5173` 引导页中的 Toonflow 云账号注册当成本地注册入口。

本次服务端使用 `work/devData`，因此首次配置后的数据库默认位于 `work/devData/multiTenant/multiTenant.sqlite`，数据源配置位于同目录的 `dataSource.json`。重启时继续使用同一 `TOONFLOW_DATA_DIR` 才能保留这组账号。关闭多租户可在后台系统配置中操作，关闭后 `10888` 停止监听，账号和数据库保留；刷新 `5173` 可恢复独立模式。

## 本次本机核对

2026-11-17 在 Windows 上以 Bun 1.4.3 启动，数据目录为 `work/devData`：

| 地址 | 结果 |
| --- | --- |
| `http://127.0.0.1:5173/` | 前端首页 HTTP 200 |
| `http://127.0.0.1:3000/api/settings/get` | 带页面来源与工作区请求头时 HTTP 200 |
| `http://127.0.0.1:5173/api/settings/get` | 经 Vite 代理、带相同请求头时 HTTP 200 |

接口核对只读取状态码，没有输出设置内容；未验证具体创作功能。

本轮多租户入口恢复后：

- `GET /api/multiTenant/status` 返回 HTTP 200，状态为 `configured: false`、`enabled: false`、`canSetup: true`，可从本机设置页首次初始化。
- 已确认 Vite 返回的设置模块包含实际多租户配置面板；浏览器已显示超级管理员登录页面。
- 已执行 `bun run --cwd apps/web build` 并通过，`build/web/index.html` 已生成；保留已有的大 chunk 提示。
- `bun run --cwd apps/web typecheck` 未通过：`electrobun.config.ts` 引用的 `.hutch/devkit/api/config/ElectrobunConfig` 类型声明缺失。
- 尚未创建管理员和普通账号，未实际提交注册或登录；`10888` 会在首次配置时开启多租户后开始监听。

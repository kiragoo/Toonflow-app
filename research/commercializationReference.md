# 商业化二开品牌与许可参考清单

整理日期：2026-11-17。

适用范围：当前仓库中的 Web 平台、服务端及可选桌面和移动端发行。以下清单用于后续商业化二开的范围确认，不表示全部依赖、素材和发行包已经完成授权审计。代码更新、依赖版本或发行方式变化后，应重新核对对应项。

## 核心结论

当前仓库根目录采用 MIT 许可证，允许修改、商业使用和分发，也不要求仅因使用这些 MIT 代码就公开二开源码。可以使用自己的产品名称、Logo、公司信息、域名、客服和收费方案。

保留上游代码或其重要部分时，需要保留原版权声明与完整 MIT 许可文本；软件发行副本也需要包含对应声明。MIT 未要求在首页、Logo 旁或主要业务页面展示原品牌，也未要求保留原 GitHub、交流群和商务入口。产品界面可以展示自己的运营主体，原代码的版权声明不能因此改为自己公司独占所有。

第三方依赖、素材、商标以及原官方云服务分别受各自许可、品牌规则或服务条款约束，不能仅凭根目录 MIT 推定获得全部授权。

## 可以替换的品牌与商业信息

下表中的“可替换”指改用自有或已获授权的内容，不代表取得原品牌和素材的全部权利。

| 项目 | 当前内容和主要位置 | 后续处理边界 |
| --- | --- | --- |
| Web 页面标题 | [apps/web/index.html](../apps/web/index.html) 中的 Toonflow | 可以改为自己的产品名称。 |
| 登录及欢迎页品牌、页脚 | [欢迎页](../apps/web/src/pages/hello/index.vue) 中的名称、Logo 和版权页脚 | 可以替换界面展示；在许可记录中保留上游版权。 |
| 关于页面 | [关于页面](../apps/web/src/components/settings/panels/about/index.vue) 中的产品信息、仓库链接、交流群及商务二维码 | 可以换为自己的介绍、客服和商务联系方式。 |
| 首页和工作区入口 | [首页](../apps/web/src/pages/home/index.vue)、[工作区](../apps/web/src/pages/workspace/index.vue) 中的宣传、教程、反馈表和社区链接 | 可以替换为自己的运营内容。 |
| 多租户登录与后台品牌 | [登录界面](../packages/multiTenant/userWeb/index.vue)、[后台界面](../packages/multiTenant/adminWeb/index.vue) 中的名称与 Logo | 可以替换界面品牌；云服务来源名称需与实际服务保持一致。 |
| Logo、应用图标和启动动画 | [品牌资源](../packages/assets)、[启动动画](../packages/startup/assets/startup.json) | 可以使用自有或已授权资源替换；启动播放器依赖的许可另行保留。 |
| 产品包元数据 | [package.json](../package.json) 中的名称、描述、作者、官网、仓库和反馈邮箱 | 可以填写自己的发行信息；元数据不能代替或覆盖上游版权声明。 |
| 桌面和移动端发行身份 | [桌面配置](../electrobun.config.ts)、[Android 清单](../apps/mobile/native/manifest.xml) 中的名称、标识符及协议配置 | 可以更换，但需要同步处理安装、更新、签名和协议唤起的关联。 |
| README 产品宣传 | [README.md](../README.md) 中的介绍、公司信息、截图和联系方式 | 可以重写，保留上游版权与许可记录，并按实际贡献添加自己的版权声明。 |

## 涉及实际服务连接的商业信息

这些入口涉及账号、收款、外部请求或内容来源，仅改名称或 Logo 不能把对应服务变成自营服务。

| 项目 | 当前实现位置与行为 | 后续需要明确的内容 |
| --- | --- | --- |
| 官方云账号、模型、钱包及充值 | [渠道选择](../apps/server/src/utils/channel/index.ts) 默认使用 toonflow；[渠道实现](../apps/server/src/utils/channel/toonflow.ts) 请求 api.toonflow.net | 自营业务需要自己的服务实现或明确的合作授权。代码许可不授予原服务账号、额度和收款体系的经营权。 |
| 账号控制台和插件市场 | [账号页面](../apps/web/src/components/settings/panels/account/index.vue)、[插件市场](../apps/web/src/components/settings/panels/pluginMarket/index.vue) 包含原控制台链接 | 明确保留第三方服务接入，还是改为自营服务；名称和服务归属应准确。 |
| 作品、广告和赞助商内容 | [渠道实现](../apps/server/src/utils/channel/toonflow.ts)、[首页](../apps/web/src/pages/home/index.vue)、[关于页面](../apps/web/src/components/settings/panels/about/index.vue) | 远程内容不能自动视为根目录 MIT 授权。自有平台的内容和赞助关系需要单独确认。 |
| 匿名统计 | [anonymousData.ts](../apps/web/src/lib/anonymousData.ts) 上报至 api.toonflow.net/web/telemetry/report | 核对实际接收方、收集内容及开关行为，匹配自己的隐私说明。当前说明见 [privacy.vue](../apps/web/src/components/settings/panels/about/privacy.vue)。 |
| 更新服务 | [桌面配置](../electrobun.config.ts)、[更新实现](../apps/server/src/utils/desktop/index.ts) 包含原发行来源 | 自有发行版需要匹配自己的更新包、发行身份和更新来源。 |
| 供应商推广文案和链接 | [apiMart.ts](../packages/providers/src/media/apiMart.ts) 含推广注册链接；[metaso.ts](../packages/providers/src/media/metaso.ts) 含来源参数链接 | 可以调整推广内容；实际供应商名称、API 地址和服务归属需保持准确。 |

## 继续使用时必须保留的版权和许可

以下是仓库中已经定位的明确声明。停止使用某组件后，应根据最终保留和分发的内容判断其许可是否仍需附带，不能直接按页面是否展示判断。

| 对象 | 明确记录 | 保留要求 |
| --- | --- | --- |
| Toonflow 上游代码 | [LICENSE](../LICENSE) | 保留 Copyright (c) 2026 HBAI-Ltd 和完整 MIT 文本，包含免责声明。可以另加自己新增代码的版权。 |
| Element Plus 本地化资源 | [license.txt](../packages/i18n/src/elementPlus/license.txt) | 保留 Element Plus 版权和完整 MIT 许可。 |
| 语言选择器国旗图案 | [languageFlags.svg](../apps/web/src/assets/languageFlags.svg) 内嵌 flag-icons 7.3.2 来源、Panayiotis Lipiridis 版权和 MIT | 继续使用图案时保留对应版权与许可，发布构建不能仅因压缩移除了 SVG 注释就遗漏声明。 |
| ThorVG 和 RapidJSON | [启动组件许可](../packages/startup/assets/license.txt)、[构建说明](../packages/startup/assets/build.md) | 分发对应启动组件时保留两者版权和许可。 |
| 其他第三方依赖 | 各实际版本中的 LICENSE、NOTICE 和源文件许可声明 | 按最终使用及分发内容逐项处理，根目录 MIT 不能替代这些许可。 |

原代码及第三方版权声明不等于产品必须使用原品牌。可在发行包附带许可文件，并在产品提供可访问的开源许可入口；对交付给浏览器的前端代码，也应确保相关声明随发布提供。仅写“感谢 Toonflow”或只放源码仓库链接，不能替代完整许可文本。

仅在服务器运行且未向用户分发的 MIT 后端代码，通常不因提供网络服务产生公开后端源码或在界面展示作者的要求；第三方依赖若采用其他许可，需另行判断。

## 需单独核对的素材与发行组件

| 内容 | 当前证据或位置 | 待确认事项 |
| --- | --- | --- |
| 原 Toonflow Logo、应用图标和启动动画 | [packages/assets](../packages/assets)、[startup.json](../packages/startup/assets/startup.json) | 本次未确认单独商标授权及完整素材来源。若继续用于商业品牌展示，应确认相应权利；也可换为自有素材。 |
| README 示例作品及截图内容 | [docs/images](../docs/images)、[README.md](../README.md) | 逐项确认图片、人物、视频和其他内容的商用权，不能把注明来源当成取得授权。 |
| 赞助商标识 | [docs/images/sponsors](../docs/images/sponsors) | 第三方标识及原项目赞助关系不自动延伸至二开平台，不应据此宣称其赞助自有产品。 |
| 模型厂商品牌图标 | [modelIcons](../packages/modelIcons/src/getModelIcon.ts)、[依赖声明](../packages/modelIcons/package.json) 使用 @lobehub/icons-static-svg | 核对实际版本许可和厂商品牌规则；不得将其归为自有商标。 |
| FFmpeg | [packages/ffmpeg](../packages/ffmpeg) | 依据实际二进制、编译选项、链接和发行方式确定 LGPL、GPL 等要求，不能仅凭宿主 MIT 得出结论。 |
| Bun、Node、WebView2、7-Zip 等发行组件 | [Bun 许可资料](../compat/ohos/bunLicense.md)、[Windows 打包逻辑](../apps/desktop/scripts/packageWindows.ts)、[原生更新工具](../apps/desktop/native/updateHelper.cs) | 以最终发行包的组件、版本和许可为准，核对版权、NOTICE、源码提供或其他适用义务。仓库内资料不等于完整发行合规结论。 |
| 插件市场和远程社区素材 | [渠道实现](../apps/server/src/utils/channel/toonflow.ts) | 插件、作品和素材按自身授权处理；原平台能够展示或下载不等于可以转售或再分发。 |

## 内部技术标识的处理边界

`@toonflow/*` 工作区包名、请求头、Cookie、事件名、数据字段和文件格式标记不需要仅为品牌独立而全部改名。它们涉及模块引用、权限校验、数据兼容和插件协议，应与界面名称分开评估，避免全局替换破坏功能。

桌面应用标识、移动端包名、签名和更新渠道虽然可以更换，但与用户安装身份相关，需按发行方案联动处理。版本升级时也要核对原生代码中的固定标识。

## 后续商业化二开顺序

1. 确认自有产品名、公司主体、Logo、域名、客服和商务联系方式。
2. 决定云账号、模型、充值、市场、社区、统计和更新分别使用自营服务还是保留第三方接入。
3. 按本清单替换界面品牌，保留上游版权及第三方许可记录。
4. 核对继续使用的素材和依赖；桌面或移动端发行时核对最终包中的运行时和二进制组件。
5. 按最终部署与发行方式安排开源许可入口、随包许可文件及自有服务协议和隐私说明。

当前阶段仅记录参考清单，不执行上述替换。

## 依据

- [仓库 MIT 许可证](../LICENSE)。
- [README 开源许可说明](../README.md)：第三方依赖和素材遵循各自的许可与版权声明。
- [贡献规范](../CONTRIBUTING.md)：提交素材前确认使用权并保留必要声明。
- [MIT 官方条款](https://opensource.org/license/mit)：商业使用、修改、分发及保留版权与许可声明的条件。
- [FFmpeg 官方许可说明](https://www.ffmpeg.org/legal.html)：具体许可取决于启用的组件和构建方式。

本清单用于实施准备，不替代针对最终商业发行物的法律审查。

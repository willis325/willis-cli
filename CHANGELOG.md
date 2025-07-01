# Changelog

## [1.2.0] - 2025-06-25
### Added
- 新增一个脚本命令
  - `release` 更新预发布 dev 分支，适用于 dev/master 模型分支仓库
- 新增 `show` 命令中的 `-l --local` 参数，用于指定当前分支

### Changed
- 优化 `tsup` 打包配置
- 新增 `util` 工具函数
- 优化项目目录结构

## [1.1.2] - 2025-01-23
### Added
- 新增 `create` 命令中的 `-t --template` 参数，用于指定 git 模板仓库快速创建

## [1.1.1] - 2024-10-28
### Fixed
- 修复 `show` 命令中 git log 在 windows 下输出异常

## [1.1.0] - 2024-10-25
### Added
- 新增一个脚本命令
  - `show` 查看本地/远程分支的详细信息
- 新增 ChangeLog 文件

### Fixed
- 修复 `publish` 命令中 git log 输出今天的提交记录异常
- 修复 `create` 命令创建分支仓库的模版异常

## [1.0.0] - 2024-10-23
### Added
- 初始版本发布
- 包含三个脚本命令，`create`, `deploy`, `publish`
  - `create` 根据 git 模板仓库快速创建一个新的项目
  - `deploy` 重新构建 docker 镜像，并重启镜像服务
  - `publish` 更新 master 主干，适用于 dev/master 模型分支仓库
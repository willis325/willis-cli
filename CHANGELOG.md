# Changelog

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
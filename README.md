# 简介

常用功能脚手架工具，支持克隆模板项目仓库、更新git仓库 master 主干分支、docker 镜像构建与重启等。

[![version](https://img.shields.io/npm/v/willis-cli.svg)](https://www.npmjs.com/package/willis-cli)
[![downloads](https://badgen.net/npm/dt/willis-cli)](https://www.npmjs.com/package/willis-cli)

# 安装

```
npm install -g willis-cli
```

# 使用

```
willis-cli -h
```



# 命令

<table>
  <tr>
    <th>Command</th>
    <th>Description</th>
    <th>Options</th>
  </tr>
  <tr>
    <td rowspan="2">create</td>
    <td rowspan="2">根据 git 模板仓库快速创建一个新的项目</td>
    <td>-f --force 强制覆盖</td>
  </tr>
  <tr>
    <td>-t --template <模板名称> 指定模板快速创建</td>
  </tr>
  <tr>
    <td>deploy</td>
    <td>重新构建 docker 镜像，并重启镜像服务</td>
    <td></td>
  </tr>
  <tr>
    <td>publish</td>
    <td>更新 master 主干，适用于 dev/master 模型分支仓库</td>
    <td></td>
  </tr>
  <tr>
    <td>show</td>
    <td>查看本地/远程分支的详细信息</td>
    <td></td>
  </tr>
</table>

## create

| 克隆指定 git 模板仓库

```sh
willis-cli create [project-name] [options]
willis-cli create
willis-cli create vue3-willis-admin -f
willis-cli create my-uniapp -t fast-vue-h5
```

## publish

| 更新线上服务，适用于 dev/master 模型分支仓库

```sh
willis-cli publish
```

## deploy

｜ 重新构建 docker 镜像，并重启镜像服务

```sh
willis-cli deploy <container-name>
```

## show
｜ 查看本地/远程分支的详细信息

```sh
willis-cli show [branch-name]
willis-cli show
willis-cli show origin/master
```
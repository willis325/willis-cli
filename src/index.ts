#! /usr/bin/env node

import './polyfills';
import pkg from '../package.json';
import { program } from 'commander';
import chalk from 'chalk';
import create from './scripts/create';
import deploy from './scripts/docker/deploy';
import publish from './scripts/git/publish';
import release from './scripts/git/release';
import show from './scripts/git/show';

program.name(pkg.name).usage('<command> [options]').description(chalk.cyanBright(pkg.description)).version(chalk.cyanBright(pkg.version));

program
  .command('create [project-name]')
  .description(chalk.green('根据 git 模板仓库快速创建一个新的项目'))
  .option('-t --template <template>', chalk.green('指定github的模板仓库'))
  .option('-f --force', chalk.green('强制覆盖，如果当前目录已存在同名目录'))
  .action(create);

program.command('deploy [container-name]').description(chalk.green('重新构建 docker 镜像，并重启镜像服务')).action(deploy);

program.command('publish').description(chalk.green('合并预发布 dev 分支到 master 主干，适用于 dev/master 模型分支仓库')).action(publish);

program.command('release').description(chalk.green('合并项目开发分支到 dev，进入预发布流程，适用于 dev/master 模型分支仓库')).action(release);

program.command('show [branch-name]').description(chalk.green('查看本地/远程分支的详细信息')).option('-l --local', chalk.green('查看本地当前分支的详细信息')).action(show);

program.parse(process.argv);

#! /usr/bin/env node

import pkg from '../package.json';
import { program } from 'commander';
import chalk from 'chalk';
import create from './scripts/create';
import deploy from './scripts/deploy';
import publish from './scripts/publish';
import branch from './scripts/branch';

program.name(pkg.name).usage('<command> [options]').description(chalk.greenBright(pkg.description)).version(pkg.version);

program
  .command('create [project-name]')
  .description(chalk.green('根据 git 模板仓库快速创建一个新的项目'))
  .option('-t --template <template>', chalk.green('指定github的模板仓库'))
  .option('-f --force', chalk.green('强制覆盖，如果当前目录已存在同名目录'))
  .action(create);

program.command('deploy [container-name]').description(chalk.green('重新构建 docker 镜像，并重启镜像服务')).action(deploy);

program.command('publish').description(chalk.green('更新 master 主干，适用于 dev/master 模型分支仓库')).action(publish);

program.command('show [branch-name]').description(chalk.green('查看本地/远程分支的详细信息')).action(branch);

program.parse(process.argv);

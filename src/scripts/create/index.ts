import ora from 'ora';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import fsPromises from 'node:fs/promises';
import getInquirerResult from './inquirer';
import { downloadAsync } from '@/utils/plugin';
import { installDependencies } from './installDeps';

export default async function clone(createName: string, createOption?: { force: boolean }) {
  const spinner = ora('模板下载中...');
  const { name, repo } = await getInquirerResult(createName);

  try {
    spinner.start();

    const destination = path.resolve(process.cwd(), name);

    // 1、判断目录是否存在
    await checkDirExists(!!createOption?.force, destination);

    // 2、从远程仓库下载
    const url = (repo.includes('.zip') || repo.includes('.git') ? 'direct:' : '') + repo;
    const param = repo.includes('.git') ? { clone: true } : {};
    await downloadAsync(url, destination, param);

    // 3、修改文件内容 package.json name
    await replacePackageJson(destination, name);

    // 4、修改文件内容 index.html title
    await replaceIndexHtml(destination, name);

    // TODO 安装依赖
    spinner.info('开始安装依赖！！！');
    await installDependencies(name);

    spinner.succeed('项目创建成功！！！');
    spinner.succeed('😊😊😊');
  } catch (error) {
    spinner.fail(chalk.red(error));
    process.exit(1);
  }
}

async function checkDirExists(force: boolean, filePath: string) {
  if (fs.existsSync(filePath)) {
    if (force) {
      await fsPromises.rm(filePath, { recursive: true, force: true });
    } else {
      throw new Error('项目已存在，-f 可强制覆盖');
    }
  }
  await fsPromises.rm(filePath, { recursive: true, force: true });
}

async function replacePackageJson(filePath: string, name: string) {
  const pkgFile = path.resolve(filePath, 'package.json');
  const pkgData = await fsPromises.readFile(pkgFile, { encoding: 'utf-8' });
  const pkgObject = JSON.parse(pkgData);
  await fsPromises.writeFile(pkgFile, pkgData.replaceAll(pkgObject.name, name), { encoding: 'utf-8' });
}

async function replaceIndexHtml(filePath: string, name: string) {
  const route = path.resolve(filePath, 'index.html');
  if (!fs.existsSync(route)) return;
  const data = await fsPromises.readFile(route, { encoding: 'utf-8' });
  await fsPromises.writeFile(route, data.replace(/<title.*?>(.*?)<\/title>/gi, `<title>${name}</title>`), { encoding: 'utf-8' });
}

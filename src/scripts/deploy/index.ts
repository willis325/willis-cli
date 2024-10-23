import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { execStdout } from '@/utils/node';
import { spinnerInfoPromise } from '@/utils/spinner';

export default async function reup(projectName: string) {
  const spinner = ora('docker命令运行中...');

  try {
    spinner.start();
    await spinnerInfoPromise(spinner, execStdout('docker ps -a'));
    await spinnerInfoPromise(spinner, execStdout('docker images'));

    const { name } = await inquirer.prompt([
      {
        name: 'name',
        type: 'input',
        default: projectName,
        message: '请输入你的容器名称',
        filter: (val) => val.trim(),
        validate: (val) => (val ? true : '容器名称必填'),
      },
    ]);

    // 1、停止并删除容器
    const containerRes = await execStdout("docker ps -a | grep '" + name + "' | awk '{ print $1 }' | xargs docker stop | xargs docker rm -f");
    spinner.info(`停止并删除容器${containerRes}`);

    // 2、删除镜像
    const imageRes = await execStdout("docker images | grep '" + name + "' | awk '{ print $3 }' | xargs docker rmi -f");
    spinner.info(`删除镜像${imageRes}`);

    // 3、构建镜像并启动
    const result = await execStdout('docker compose up -d --no-recreate --no-deps --build');
    spinner.info(`重新构建并重启${result}`);

    // 4、观察容器运行情况
    await spinnerInfoPromise(spinner, execStdout('docker ps -a'));

    spinner.succeed('项目更新成功！！！');
    spinner.succeed('😊😊😊');
  } catch (error) {
    spinner.fail(chalk.red(error));
    process.exit(1);
  }
}

import ora from 'ora';
import chalk from 'chalk';
import getInquirerResult from './inquirer';
import { execStdout } from '@/utils/node';
import { spinnerInfoPromise } from '@/utils/spinner';

export default async function branch(defaultName?: string) {
  const spinner = ora('分支信息查看中...');
  const name = await getName(defaultName);

  try {
    spinner.start();

    const currentName = await execStdout('git branch --show-current');
    const remoteUrl = await execStdout('git remote get-url origin');
    const branchName = name && name.startsWith('origin/') ? name.replace(/^origin\//, '') : name ? name : currentName.trim();

    await spinnerInfoPromise(
      spinner,
      execStdout(`git log ${name} -1 --pretty=format:"%n提交人: %an %n提交日期: %cd %n分支名: ${branchName} %n版本号: %H %n远程地址: ${remoteUrl} %n提交日志: %s" --date=iso`),
    );

    spinner.succeed('分支信息！！！');
    spinner.succeed('😊😊😊');
  } catch (error) {
    spinner.fail(chalk.red(error));
    process.exit(1);
  }
}

async function getName(defaultName?: string) {
  if (defaultName) return defaultName;
  const { name } = await getInquirerResult();
  return name;
}

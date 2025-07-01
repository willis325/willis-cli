import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { execStdout } from '@/utils/node';
import { spinnerInfo } from '@/utils/util';

export default async function show(defaultName?: string, options?: { local: boolean }) {
  const spinner = ora('分支信息查看中...');

  try {
    spinner.start();

    const name = await getName(defaultName, options);
    const currentName = await execStdout('git branch --show-current');
    const remoteUrl = await execStdout('git remote get-url origin');
    const branchName = name && name.startsWith('origin/') ? name.replace(/^origin\//, '') : name ? name : currentName.trim();

    await spinnerInfo(
      spinner,
      execStdout(`git log ${name} -1 --pretty=format:"%n提交人: %an %n提交日期: %cd %n分支名: ${branchName} %n版本号: %H %n仓库地址: ${remoteUrl} %n提交日志: %s" --date=iso`),
    );

    spinner.succeed('分支信息！！！');
    spinner.succeed('😊😊😊');
  } catch (error) {
    spinner.fail(chalk.red(error));
    process.exit(1);
  }
}

// 获取分支名称
async function getName(defaultName?: string, options?: { local: boolean }) {
  if (defaultName) return defaultName;
  if (options?.local) return '';
  const { name } = await getInquirerResult();
  return name;
}

async function getInquirerResult() {
  return inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: `请输入你要查看的分支名称，不输入则默认查看当前分支
  ${chalk.gray('本地分支 - feature/fqw/init')}  
  ${chalk.gray('远程分支 -  origin/feature/fqw/init')}         
  ${chalk.gray('不输入任何内容  -  默认当前分支')}         
 `,
      filter: (val) => val.trim(),
    },
  ]);
}

import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { checkGitClean, checkGitModified, executeCommand } from '@/utils/util';

export default async function publish() {
  const spinner = ora('git仓库更新中...');

  try {
    // 1、检查目录及分支
    spinner.start();
    await executeCommand(spinner, 'pwd', [], '当前目录');
    const current = await executeCommand(spinner, 'git branch', ['--show-current'], '当前分支');

    // 2、检查是否有未提交的代码；切换到master分支
    await checkGitClean();
    if (current !== 'master') await executeCommand(spinner, 'git checkout', ['master'], '切换到master分支');

    // 3、拉取远程代码
    await executeCommand(spinner, 'git fetch', []);
    await executeCommand(spinner, 'git pull', ['origin', 'master']);
    await executeCommand(spinner, 'git merge', ['origin/dev']);

    // 4、判断是否有冲突
    await executeCommand(spinner, 'git status');
    await checkGitModified();
    await executeCommand(spinner, 'git show', ['--no-patch']);

    // 5、确认是否更新
    const result = await inquirer.prompt([{ name: 'judge', type: 'confirm', message: '请确认是否推送master分支到远程仓库？' }]);
    if (!result.judge) throw new Error('您已取消更新');

    await executeCommand(spinner, 'git push', ['origin', 'master']);
    await executeCommand(spinner, 'git log', ['-5', '--pretty=format:"%nAuthor: %an %nDate: %cd %nCommit: %H %nMessage: %s"', '--date=iso']);

    spinner.succeed('更新成功！！！');
    spinner.succeed('😊😊😊');
  } catch (error) {
    spinner.fail(chalk.red(error));
    process.exit(1);
  }
}

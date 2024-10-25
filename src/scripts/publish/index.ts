import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { execStdout } from '@/utils/node';
import { spinnerInfoPromise } from '@/utils/spinner';

export default async function publish() {
  const spinner = ora('git仓库更新中...');

  try {
    // 1、检查目录及分支
    spinner.start();
    await spinnerInfoPromise(spinner, prefixSyncResult('当前目录', execStdout('pwd')));
    await spinnerInfoPromise(spinner, prefixSyncResult('当前分支', getCurrentBranch()));

    // 2、检查是否有未提交的代码；切换到master分支
    if (!(await checkGitStatus())) throw new Error('当前分支有未提交的代码，请检查处理后，重新运行命令！');
    if ((await getCurrentBranch()) !== 'master') await spinnerInfoPromise(spinner, prefixSyncResult('切换到master分支', execStdout('git checkout master')));

    // 3、拉取远程代码
    await spinnerInfoPromise(spinner, prefixSyncResult('git fetch', execStdout('git fetch')));
    await spinnerInfoPromise(spinner, prefixSyncResult('git pull', execStdout('git pull origin master')));
    await spinnerInfoPromise(spinner, prefixSyncResult('git merge', execStdout('git merge origin/dev')));

    // 4、判断是否有冲突
    if (!(await checkGitStatus())) throw new Error('有未解决的冲突，请手动解决后手动更新');
    await spinnerInfoPromise(spinner, prefixSyncResult('git show', execStdout('git show --no-patch')));

    // 5、确认是否更新
    const result = await inquirer.prompt([{ name: 'judge', type: 'confirm', message: '请确认是否推送master分支到远程仓库？' }]);
    if (!result.judge) throw new Error('您已取消更新');

    await spinnerInfoPromise(spinner, prefixSyncResult('git push', execStdout('git push origin master')));
    await spinnerInfoPromise(
      spinner,
      prefixSyncResult('git log', execStdout('git log --since="today 00:00:00" --pretty=format:"%nAuthor: %an %nDate: %cd %nCommit: %H %nMessage: %s" --date=iso')),
    );
    await spinnerInfoPromise(
      spinner,
      prefixSyncResult('git log', execStdout('git log -1 --until="yesterday" --pretty=format:"%nAuthor: %an %nDate: %cd %nCommit: %H %nMessage: %s" --date=iso')),
    );

    spinner.succeed('更新成功！！！');
    spinner.succeed('😊😊😊');
  } catch (error) {
    spinner.fail(chalk.red(error));
    process.exit(1);
  }
}

async function getCurrentBranch() {
  const branch = await execStdout('git branch --show-current');
  return branch.trim();
}

async function checkGitStatus() {
  const info = await execStdout('git status');
  return info.includes('nothing to commit, working tree clean');
}

async function prefixSyncResult<T = string>(label: string, promise: Promise<T>) {
  const value = await promise;
  return label + '：' + value;
}

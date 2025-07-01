import ora, { Ora } from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { checkGitClean, checkGitModified, executeCommand } from '@/utils/util';

export default async function release() {
  const spinner = ora('git仓库更新中...');

  try {
    spinner.start();

    // 1、检查目录及分支
    await executeCommand(spinner, 'pwd', [], '当前目录');
    const current = await executeCommand(spinner, 'git branch', ['--show-current'], '当前分支');

    // 2、检查是否有未提交的代码，切换到dev分支
    await checkGitClean();
    const targetBranch = current === 'dev' ? await getNeedMergeBranch() : current;
    current !== 'dev' && (await executeCommand(spinner, 'git checkout', ['dev']));

    // 3、拉取dev远程代码，合并提交分支
    await executeCommand(spinner, 'git fetch');
    await executeCommand(spinner, 'git pull', ['origin', 'dev']);
    await checkGitClean();
    await squashMergeBranch(spinner, targetBranch);
    await executeCommand(spinner, 'git status');
    await checkGitModified();

    // 4、提交代码
    const { type, judge, fallback, message } = await getCommitMessage();
    if (type === 0) return await fallbackMerge(spinner);
    if (type === 1 && !judge) {
      if (fallback) return await fallbackMerge(spinner);
      throw new Error('您已取消更新');
    }

    await executeCommand(spinner, 'git commit', ['-m', `"${message}"`]);
    await executeCommand(spinner, 'git push', ['origin', 'dev']);
    await executeCommand(spinner, 'git log', ['-3', '--pretty=format:"%nAuthor: %an %nDate: %cd %nCommit: %H %nMessage: %s"', '--date=iso']);
    spinner.succeed('更新成功！！！');
    spinner.succeed('😊😊😊');
  } catch (error) {
    spinner.fail(chalk.red(error));
    process.exit(1);
  }
}

// 获取需要合并的分支
async function getNeedMergeBranch() {
  const { branch } = await inquirer.prompt([
    { name: 'branch', type: 'input', message: '请输入你要合并【squash merge】的分支', filter: (v) => v.trim(), validate: (v) => (v.trim() ? true : '分支名称必填') },
  ]);
  return branch;
}

// merge --squash
async function squashMergeBranch(spinner: Ora, targetBranch: string) {
  try {
    await executeCommand(spinner, 'git merge', ['--squash', targetBranch]);
  } catch {
    throw new Error('当前分支有未解决的冲突，请手动解决！');
  }
}

// 获取合并后需要提交的信息
async function getCommitMessage() {
  return await inquirer.prompt([
    {
      name: 'type',
      type: 'list',
      message: '请选择本次操作类型',
      choices: [
        { name: '代码白盒', value: 0 },
        { name: '版本预发布', value: 1 },
      ],
      default: 0,
    },
    { name: 'review', type: 'input', message: '代码白盒中，请在白盒完成后输入任意字符，将回退本次dev分支的merge操作', when: (r) => r.type === 0 },
    { name: 'judge', type: 'confirm', message: '请确认是否推送dev分支到远程仓库？', when: (r) => r.type === 1 },
    { name: 'fallback', type: 'confirm', message: '请确认是否回退本次dev分支的merge操作？', when: (r) => !r.judge },
    { name: 'message', type: 'input', message: '请输入本次提交的描述', filter: (v) => v.trim(), validate: (v) => (v.trim() ? true : '提交描述必填'), when: (r) => r.judge },
  ]);
}

// merge 回退
async function fallbackMerge(spinner: Ora) {
  await executeCommand(spinner, 'git reset', ['--hard']);
  spinner.succeed('代码已回退！！！');
  spinner.succeed('😊😊😊');
}

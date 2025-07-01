import { Ora } from 'ora';
import { execStdout } from './node';

// spinner.info 打印执行结果
export const spinnerInfo = async (spinner: Ora, info: Promise<string> | string) => {
  const value = await (info instanceof Promise ? info : Promise.resolve(info));
  spinner.info(value);
};

// 执行 command 命令，并输出执行结果
export const executeCommand = async (spinner: Ora, command: string, args: string[] = [], label?: string) => {
  const result = await execStdout(`${command} ${args.join(' ')}`);
  const message = (label ?? command) + '：' + result;
  spinner.info(message);
  return result.trim() ?? '';
};

// 检查当前分支是否有未提交的代码
export const checkGitClean = async () => {
  const info = await execStdout('git status');
  const judge = info.includes('nothing to commit, working tree clean');
  if (!judge) throw new Error('当前分支有未提交的代码，请手动解决！');
  return judge;
};

// 检查当前分支是否有冲突的代码
export const checkGitModified = async () => {
  const info = await execStdout('git status');
  const judge = info.includes('Unmerged paths:');
  if (judge) throw new Error('当前分支有未解决的冲突，请手动解决！');
  return judge;
};

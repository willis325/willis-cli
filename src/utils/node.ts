import util from 'node:util';
import childProcess from 'node:child_process';

const exec = util.promisify(childProcess.exec);

/**
 * 执行 shell 命令，返回执行结果
 * @param command shell命令
 * @param options childProcess.ExecOptions
 * @returns 控制台执行结果
 */
export const execStdout = async (command: string, options: childProcess.ExecOptions = {}) => {
  const result = await exec(command, options);
  return result.stdout;
};

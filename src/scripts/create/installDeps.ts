import path from 'node:path';
import fs from 'node:fs';
import ora from 'ora';
import childProcess from 'node:child_process';
import chalk from 'chalk';
import util from 'node:util';
const exec = util.promisify(childProcess.exec);
import { getPackageManager } from './inquirer';

export const LOCKS: any = {
    'package-lock.json': 'npm',
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
};

/**
 * 在当前工作目录及其父目录中查找指定的文件列表中的第一个存在的文件，并返回其完整路径。
 * 如果找不到任何文件，则返回空字符串。
 * @param {string[]} files - 要查找的文件名列表
 * @returns {string} - 找到的文件的完整路径，或空字符串（如果未找到）
 */
const findUp = (files: string[]): string => {
    let foundLockFile = '';
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            foundLockFile = filePath;
            break;
        }
    }
    return foundLockFile;
};

/**
 * 检测并返回当前项目中使用的包管理工具。
 * 首先检查`package.json`中的配置，然后查找锁文件，最后通过用户手动选择确定。
 * @returns {Promise<string>} 返回一个包含包管理工具名称的Promise对象。
 */
export const detect = () => {
    return new Promise((resolve) => {
        let agent = '';
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        // package.json中配置了
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const packageManager = (packageJson as any).packageManager || '';
            packageManager && (agent = packageManager.split('@')[0]);
        }
        if (agent) {
            resolve(agent);
            return;
        }
        // 有lock文件
        const lockFilePath = findUp(Object.keys(LOCKS));
        if (fs.existsSync(lockFilePath)) {
            const lockFileType = path.basename(lockFilePath);
            agent = LOCKS[lockFileType];
        }
        if (agent) {
            resolve(agent);
            return;
        }

        // 手动选择
        getPackageManager().then((answers) => {
            resolve(answers.packageManager);
        });
    });
};

/**
 * 安装项目依赖
 * @param {string} projectName - 项目名称
 * @returns {Promise<void>}
 * 该函数会切换到指定项目目录，使用指定的包管理器安装项目依赖，并在安装完成后退出进程。
 * 如果安装过程中出现错误，会打印错误信息并退出进程。
 */
export const installDependencies = async (projectName: string) => {
    process.chdir(projectName);

    const gitDir = path.join(process.cwd(), '.git');
    if (!fs.existsSync(gitDir)) {
        await exec('git init')
    }

    const agent = await detect();
    const spinner = ora('Start install...');
    spinner.start();
    const { stdout, stderr } = await exec(`${agent} install`);
    if (stderr) {
        spinner.fail(stderr);
        process.exit();
    }
    spinner.info(stdout);
    spinner.info(chalk.green(`\n cd ${projectName} 目录 && git remote add origin <origin> && ...\n`));
    process.exit();
};

import inquirer from 'inquirer';
import chalk from 'chalk';

export default function getCloneInfo(createName: string) {
  return inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      default: createName,
      message: '请输入你的项目名称',
      filter: (val) => val.trim(),
      validate: (val) => (val ? true : '项目名称必填'),
    },
    {
      name: 'repo',
      type: 'input',
      message: `请输入你要克隆的模板仓库 git 地址
  ${chalk.gray('GitHub - github:owner/name or simply owner/name')}
  ${chalk.gray('GitLab - gitlab:owner/name')}
  ${chalk.gray('Bitbucket - bitbucket:owner/name')}
  ${chalk.gray('私有仓库 - git 仓库链接地址（https://github.com/willis325/willis-cli.git）')}
  ${chalk.gray('更多输入格式信息请看 https://www.npmjs.com/package/download-git-repo')}
 `,
      filter: (val) => val.trim(),
      validate: (val) => (val ? true : 'git 仓库必填'),
    },
  ]);
}

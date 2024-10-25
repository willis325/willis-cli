import inquirer from 'inquirer';
import chalk from 'chalk';

export default function getInquirerResult() {
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

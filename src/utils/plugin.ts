import util from 'node:util';
import download from 'download-git-repo';

/**
 * 下载远程仓库
 * @param {string} repo 仓库地址
 * @param {string} dest 下载目录
 * @param {object} options 下载选项
 */
export const downloadAsync = util.promisify(download);

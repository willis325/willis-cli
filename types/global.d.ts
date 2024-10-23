declare module 'download-git-repo' {
  const download: (repo: string, dest: string, options: any, callback: (err: Error) => void) => void;
  export default download;
}

import simpleGit from 'simple-git';
import type { SimpleGitOptions, SimpleGit, PullResult } from 'simple-git';

// const options: SimpleGitOptions = {
//   baseDir: process.cwd(),
//   binary: 'git',
//   maxConcurrentProcesses: 10,
// };

export const gitInstance: SimpleGit = simpleGit();

export async function gitPull(): Promise<PullResult> {
  return await gitInstance.pull();
}

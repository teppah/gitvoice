import simpleGit from 'simple-git';
import type { SimpleGitOptions, SimpleGit, PullResult } from 'simple-git';
import * as vscode from 'vscode';

const options: SimpleGitOptions = {
  // screw deprecation amirite????
  baseDir: vscode.workspace.rootPath ?? "",
  binary: 'git',
  maxConcurrentProcesses: 10,
};

export const gitInstance: SimpleGit = simpleGit(options);

export async function gitPull(): Promise<PullResult> {
  return await gitInstance.pull();
}

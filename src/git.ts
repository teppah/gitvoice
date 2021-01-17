import simpleGit, { CommitResult, PushResult, StatusResult } from 'simple-git';
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

export async function gitCommit(message: string): Promise<CommitResult> {
  return await gitInstance.commit(message); //committing all changes in directory
}

export async function gitPush(): Promise<PushResult> {
  return await gitInstance.push();
}

export async function gitStatus(): Promise<StatusResult> {
  return await gitInstance.status();
}

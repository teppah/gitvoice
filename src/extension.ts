// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as express from 'express';
const ngrok = require('ngrok');
import type { Request, Response } from 'express';
import * as parser from 'body-parser';
import { Server, STATUS_CODES } from 'http';
import { BodyFormat } from './types/format';
import {
  gitPull,
  gitInstance,
  gitCommit,
  gitPush,
  gitStatus,
  gitAddAll,
  gitCheckOut,
} from './git';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const app: express.Application = express();
const port = 6969;

app.use(parser.json());
app.post('/pull', async (req: Request, res: Response) => {
  let body: BodyFormat = req.body;
  console.log(`origin: ${JSON.stringify(req.connection.remoteAddress)}`);
  console.log(`params: ${JSON.stringify(req.params)}`);
  console.log(`body: ${JSON.stringify(body)}`);
  // default to git pull for now
  try {
    let response = await gitPull();
    res.json({ status: 'success', response });
    vscode.window.showInformationMessage(
      `SUCCESS: ${JSON.stringify(response)}`
    );
  } catch (e) {
    res.json({ status: 'error', error: e });
    vscode.window.showErrorMessage(`ERROR: ${JSON.stringify(e)}`);
  }
  console.log(process.cwd());
});

app.post('/commitall', async (req: Request, res: Response) => {
  try {
    let message = "No Message";
    if (req.body.message) {
      message = req.body.message
    }
    let response = await gitCommit(message);
    res.json({ status: 'success', response });
    vscode.window.showInformationMessage(
      `All files committed: ${JSON.stringify(response)}`
    );
  } catch (error) {
    res.json({ status: 'error', error: error });
    vscode.window.showErrorMessage(
      `Error committing files: ${JSON.stringify(error)}`
    );
  }
});

app.post('/addall', async (req: Request, res: Response) => {
  try {
    await gitAddAll();
    res.json({ status: 'success' });
    vscode.window.showInformationMessage(`All files added`);
  } catch (error) {
    res.json({ status: 'error', error: error });
    vscode.window.showErrorMessage(
      `Error adding files: ${JSON.stringify(error)}`
    );
  }
});

app.post('/push', async (req: Request, res: Response) => {
  try {
    let response = await gitPush();
    res.json({ status: 'success', response });
    vscode.window.showInformationMessage(
      `Push successful: ${JSON.stringify(response)}`
    );
  } catch (error) {
    res.json({ status: 'error', error: error });
    vscode.window.showErrorMessage(
      `Error pushing: ${JSON.stringify(error)}`
    );
  }
});

app.post('/status', async (req: Request, res: Response) => {
  try {
    let response = await gitStatus();
    res.json({ status: 'success', response });
    vscode.window.showInformationMessage(
      `Git status: ${JSON.stringify(response)}`
    );
  } catch (error) {
    res.json({ status: 'error', error: error });
    vscode.window.showErrorMessage(
      `Error retrieving status: ${JSON.stringify(error)}`
    );
  }
});

app.post('/checkout', async (req: Request, res: Response) => {
  try {
    let response = await gitCheckOut();
    res.json({ status: 'success', response });
    vscode.window.showInformationMessage(
      `Checkout success: ${JSON.stringify(response)}`
    );
  } catch (error) {
    res.json({ status: 'error', error: error });
    vscode.window.showErrorMessage(
      `Checkout failed: ${JSON.stringify(error)}`
    );
  }
});

let server: Server | null = null;
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "helpr" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand('helpr.helloWorld', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Hello VS CODE!');
  });

  const startServer = vscode.commands.registerCommand(
    'helpr.startServer',
    () => {
      if (server === null) {
        server = app.listen(port, () => {
          vscode.window.showInformationMessage(`server started! port: ${port}`);
        });
      } else {
        vscode.window.showInformationMessage(
          `Server is already started. port: ${port}`
        );
      }
    }
  );

  const closeServer = vscode.commands.registerCommand(
    'helpr.stopServer',
    () => {
      if (server === null) {
        vscode.window.showInformationMessage(
          'Server not started yet. Run: command palette: "helpr.startServer"'
        );
      } else {
        ngrok.disconnect();
        server.close();
        server = null;
        vscode.window.showInformationMessage('Server stopped.');
      }
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(startServer);
  context.subscriptions.push(closeServer);

  // with onStartupFinished event specified in package.json, will autorun
  server = app.listen(port, async () => {
    const url = await ngrok.connect({
        addr: port,
        subdomain: 'static',
        authtoken: '1QIzm1rKPcH0Y6BF94wlXqcCuCq_5rwrY69TF3MYHbvmUtJ2E'
      });
    console.log(url);
    vscode.window.showInformationMessage(
      `server started! port: ${port}, link: ${url}`,
      'helpr.stopServer'
    );
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
  server?.close();
}

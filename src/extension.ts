// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as express from 'express';
import type { Request, Response } from 'express';
import * as parser from 'body-parser';
import { Server } from 'http';
import { start } from 'repl';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const app: express.Application = express();
const port = 6969;

app.use(parser.json());
app.get('/', (req: Request, res: Response) => {
  console.log(`origin: ${req.connection.remoteAddress}`);
  console.log(`params: ${req.params}`);
  console.log(`body: ${req.body}`);
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
          vscode.window.showInformationMessage(`SERVER STARTED! port: ${port}`);
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
        server.close();
        server = null;
        vscode.window.showInformationMessage('Server stopped.');
      }
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(startServer);
  context.subscriptions.push(closeServer);
}

// this method is called when your extension is deactivated
export function deactivate() {
  server?.close();
}

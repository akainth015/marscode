// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from "child_process";
import { ChildProcess } from 'node:child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('marscode.assembleAndRun', () => {

		const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
		if (!filePath) {
			return;
		}

		const marsJar = vscode.workspace.getConfiguration().get("marscode.jar") as string;

		const writeEmitter = new vscode.EventEmitter<string>();

		let marsProc: ChildProcess;
		const pty: vscode.Pseudoterminal = {
			onDidWrite: writeEmitter.event,
			open: () => {
				marsProc = exec(`java -cp "${marsJar}" Mars "${filePath}"`);
				marsProc.stdout?.on("data", (data: string) => {
					writeEmitter.fire(data.replace(/\r\n|\r|\n/g, "\r\n"));
				});
				marsProc.on("close", console.log);
				marsProc.on("error", console.error);
			},
			close: () => {
				marsProc.kill();
			},
			handleInput(data) {
				writeEmitter.fire(data.replace(/\r\n|\r|\n/g, "\r\n"));
				marsProc.stdin?.write(data);
			}
		};
		const terminal = vscode.window.createTerminal({ name: 'MARS', pty });
		terminal.show();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

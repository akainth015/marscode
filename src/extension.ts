import * as vscode from 'vscode';
import { exec } from "child_process";
import { ChildProcess } from 'node:child_process';
import { sep } from "path";

function openCustomTerminal(command: string) {
	const writeEmitter = new vscode.EventEmitter<string>();

	let marsProc: ChildProcess;

	const pty: vscode.Pseudoterminal = {
		onDidWrite: writeEmitter.event,
		open: () => {
			marsProc = exec(command);
			marsProc.stdout?.on("data", (data: string) => {
				writeEmitter.fire(data.replace(/\r\n|\r|\n/g, "\r\n"));
			});
			marsProc.stderr?.on("data", (data: string) => {
				writeEmitter.fire(data);
			});
			marsProc.on("close", (code) => {
				writeEmitter.fire(`\r\nYour program finished running. IDE exited with exit code ${code}.\r\n`);
			});
			marsProc.on("error", console.error);
		},
		close: () => {
			marsProc.kill();
		},
		handleInput(data) {
			if (marsProc.exitCode === null) {
				writeEmitter.fire(data.replace(/\r\n|\r|\n/g, "\r\n"));
				marsProc.stdin?.write(data);
			}
		}
	};
	const terminal = vscode.window.createTerminal({ name: 'MARS', pty });
	terminal.show();
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('marscode.termInject', () => {
			const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
			if (filePath === undefined) {
				return;
			}

			const marsJar =
				vscode.workspace.getConfiguration().get("marscode.marsJAR") as string
				|| vscode.extensions.getExtension("akainth015.marscode")!!.extensionPath + sep + "mars-4.5.jar";

			vscode.window.activeTerminal?.sendText(`java -cp "${marsJar}" Mars "${filePath}"`, false);
			vscode.window.activeTerminal?.show();
		}),
		vscode.commands.registerCommand('marscode.assembleAndRun', () => {
			const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
			if (filePath === undefined) {
				return;
			}

			const marsJar =
				vscode.workspace.getConfiguration().get("marscode.marsJAR") as string
				|| vscode.extensions.getExtension("akainth015.marscode")!!.extensionPath + sep + "mars-4.5.jar";

			openCustomTerminal(`java -cp "${marsJar}" Mars "${filePath}"`);
		}),
		vscode.commands.registerCommand('marscode.runWithBitmap', () => {
			const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
			if (filePath === undefined) {
				return;
			}

			const marsJar =
				vscode.workspace.getConfiguration().get("marscode.marsJAR") as string
				|| vscode.extensions.getExtension("akainth015.marscode")!!.extensionPath + sep + "mars-4.5.jar";

			openCustomTerminal(`java -cp "${marsJar}" mars.tools.BitmapDisplay "${filePath}"`);
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }

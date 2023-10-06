// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands, Disposable, window, Task, TaskScope, ShellExecution, tasks, Uri } from 'vscode';
import { CodelensProvider } from './utils/codeLensProvider';
import { getCwd } from './utils/config';
import { getSingleCaseObj } from './utils/getSingleCaseObj';
import fs = require("fs")
import { getSingleMetaJSON } from './utils/getSingleMetaJSON';
import path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let disposables: Disposable[] = [];

const getRunSpecTask = (command: string) => {

	return new Task(
		{ type: "start-process", script: "run" },
		TaskScope.Workspace,
		"Run",
		"start-process",
		new ShellExecution(`Start-Process -FilePath """powershell""" -Verb RunAs -ArgumentList """-NoExit""","""-Command""","""${command}"""`) // 定义任务执行方式
	);
}

export function activate(context: ExtensionContext) {
	const codelensProvider = new CodelensProvider();
	const notificationPs1 = path.join(context.extensionPath, 'src/utils', 'notification.ps1 -Path');
	languages.registerCodeLensProvider("json", codelensProvider);

	/* Run spec */
	commands.registerCommand("vp.run-spec-local", (args: string[]) => {
		window.showInformationMessage(`VP local start ${args[0]}`);
		const workspacePath = getCwd()
		const filePath = args[0].split("\\visualparity-tests\\")[1].replace(/\\/g, "/")
		const npmCommand = `cd ${workspacePath};npm run test:vp -- -- --local --input '${filePath}';${notificationPs1} ${args[0]}`
		tasks.executeTask(getRunSpecTask(npmCommand))
	});

	commands.registerCommand("vp.run-spec-online", async (args: string[]) => {
		const spalink = await window.showInputBox({
			prompt: 'If you want to use online build, please leave the input box blank and click the Enter button directly.',
			placeHolder: 'Build Number'
		})
		if (spalink === undefined) {
			return
		}
		window.showInformationMessage(`VP online ${spalink} start ${args[0]}`);
		const workspacePath = getCwd()
		const filePath = args[0].split("\\visualparity-tests\\")[1].replace(/\\/g, "/")
		const npmCommand = `cd ${workspacePath};npm run test:vp -- -- --input '${filePath}' ${spalink ? `--spalink ${spalink}` : ""};${notificationPs1} ${args[0]}`
		tasks.executeTask(getRunSpecTask(npmCommand));
	});

	commands.registerCommand("vp.debug-spec", (args: string[]) => {
		window.showInformationMessage(`VP debug ${args}`);
		const workspacePath = getCwd()
		const filePath = args[0].split("\\visualparity-tests\\")[1].replace(/\\/g, "/")
		const npmCommand = `cd ${workspacePath};npm run test:vp:debug -- -- --local --input '${filePath}'`
		tasks.executeTask(getRunSpecTask(npmCommand));
	});

	/* Run spec end */


	/* Run case */
	commands.registerCommand("vp.run-case-local", async (args: [string, number]) => {
		window.showInformationMessage(`VP local start ${args[0]}`);
		const workspacePath = getCwd()
		const singleCase = getSingleCaseObj(args[0], args[1])
		const pathArr = args[0].split('\\')
		const tempFilePath = `${pathArr.slice(0, pathArr.length - 1).join('/')}/_temp_${pathArr[pathArr.length - 1]}`
		fs.writeFileSync(tempFilePath, JSON.stringify(singleCase))

		const originMetaFilePath = `${pathArr.slice(0, pathArr.length - 1).join('/')}/${pathArr[pathArr.length - 1].replace(".spec.json", ".metadata.json")}`.replace(/\\/g, "/")
		const newMetaFilePath = `${pathArr.slice(0, pathArr.length - 1).join('/')}/_temp_${pathArr[pathArr.length - 1]}`.replace(".spec.json", ".metadata.json")
		if (fs.existsSync(originMetaFilePath)) {
			fs.writeFileSync(newMetaFilePath, getSingleMetaJSON(originMetaFilePath, singleCase.tests[0].testCase))
		}
		
		const filePath = tempFilePath.split("/visualparity-tests/")[1].replace(/\\/g, "/")
		const npmCommand = `cd ${workspacePath};npm run test:vp -- -- --local --input '${filePath}';${notificationPs1} ${args[0]}`
		tasks.executeTask(getRunSpecTask(npmCommand))
	});

	commands.registerCommand("vp.run-case-online", async (args: [string, number]) => {
		const spalink = await window.showInputBox({
			prompt: 'If you want to use online build, please leave the input box blank and click the Enter button directly.',
			placeHolder: 'Build Number'
		})
		if (spalink === undefined) {
			return
		}
		window.showInformationMessage(`VP local start ${args[0]}`);
		const workspacePath = getCwd()
		const singleCase = getSingleCaseObj(args[0], args[1])
		const pathArr = args[0].split('\\')
		const tempFilePath = `${pathArr.slice(0, pathArr.length - 1).join('/')}/_temp_${pathArr[pathArr.length - 1]}`
		fs.writeFileSync(tempFilePath, JSON.stringify(singleCase))

		const originMetaFilePath = `${pathArr.slice(0, pathArr.length - 1).join('/')}/${pathArr[pathArr.length - 1].replace(".spec.json", ".metadata.json")}`.replace(/\\/g, "/")
		const newMetaFilePath = `${pathArr.slice(0, pathArr.length - 1).join('/')}/_temp_${pathArr[pathArr.length - 1]}`.replace(".spec.json", ".metadata.json")
		if (fs.existsSync(originMetaFilePath)) {
			fs.writeFileSync(newMetaFilePath, getSingleMetaJSON(originMetaFilePath, singleCase.tests[0].testCase))
		}
		
		const filePath = tempFilePath.split("/visualparity-tests/")[1].replace(/\\/g, "/")
		const npmCommand = `cd ${workspacePath};npm run test:vp -- -- --input '${filePath}' ${spalink ? `--spalink ${spalink}` : ""};${notificationPs1} ${args[0]}`
		tasks.executeTask(getRunSpecTask(npmCommand));
	});
	/* Run case end */


	/* Run folder and file */
	commands.registerCommand("vp.run-spec-local-folder", (args: Uri) => {
		window.showInformationMessage(`VP local start ${args.path.slice(1)}`);
		const workspacePath = getCwd()
		const filePath = args.path.split("/visualparity-tests/")[1]
		const npmCommand = `cd ${workspacePath};npm run test:vp -- -- --local --input '${filePath}';${notificationPs1} ${args.path.slice(1)}`
		tasks.executeTask(getRunSpecTask(npmCommand))
	});

	commands.registerCommand("vp.run-spec-online-folder", async (args: Uri) => {
		const spalink = await window.showInputBox({
			prompt: 'Build Number',
		})
		window.showInformationMessage(`VP online ${spalink} start ${args.path.slice(1)}`);
		const workspacePath = getCwd()
		const filePath = args.path.split("/visualparity-tests/")[1]
		const npmCommand = `cd ${workspacePath};npm run test:vp -- -- --input '${filePath}' ${spalink ? `--spalink ${spalink}` : ""};${notificationPs1} ${args.path.slice(1)}`
		tasks.executeTask(getRunSpecTask(npmCommand));
	});
	/* Run folder and file end */
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (disposables) {
		disposables.forEach(item => item.dispose());
	}
	disposables = [];
}
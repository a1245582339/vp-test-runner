// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands, Disposable, workspace, window, Task, TaskScope, ShellExecution, tasks, Uri } from 'vscode';
import { CodelensProvider } from './utils/codeLensProvider';
import { getCwd } from './utils/config';
import { getSingleCaseObj } from './utils/getSingleCaseObj';
import fs = require("fs")
import { getSingleMetaJSON } from './utils/getSingleMetaJSON';
import path = require('path');
import { addLocalStorage } from './utils/addLocalStorage';
import { addFlight } from './utils/addFlight';

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
};

export function activate(context: ExtensionContext) {
	const codelensProvider = new CodelensProvider();
	const notificationPs1 = path.join(context.extensionPath, 'assets', 'notification.ps1 -Path');
	const templateFileFolderPath = path.join(context.extensionPath, 'assets', 'template');
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
		if (spalink === undefined) {
			return
		}
		window.showInformationMessage(`VP online ${spalink} start ${args.path.slice(1)}`);
		const workspacePath = getCwd()
		const filePath = args.path.split("/visualparity-tests/")[1]
		const npmCommand = `cd ${workspacePath};npm run test:vp -- -- --input '${filePath}' ${spalink ? `--spalink ${spalink}` : ""};${notificationPs1} ${args.path.slice(1)}`
		tasks.executeTask(getRunSpecTask(npmCommand));
	});
	/* Run folder and file end */

	/* VP spec template */
	commands.registerCommand("vp.create-spec-file", async (args: Uri) => {
		const templates = fs.readdirSync(templateFileFolderPath).map(item => item.replace(".spec.json", ""))
		const templateName = await window.showQuickPick(templates, {
			placeHolder: "Select a template to create a spec file"
		})
		if (!templateName) {
			return
		}
		const newSpecFileName = await window.showInputBox({
			prompt: 'New spec file name',
		})
		if (newSpecFileName === undefined) {
			return
		}
		const templateFilePath = path.join(templateFileFolderPath, `${templateName}.spec.json`)
		const folderPath = args.path.slice(1)
		const newSpecFilePath = path.join(folderPath, `${newSpecFileName}.spec.json`)

		fs.copyFile(templateFilePath, newSpecFilePath, (err) => {
			console.log(err)
			})
		workspace.openTextDocument(newSpecFilePath).then((doc) => {
			window.showTextDocument(doc);
		});
	});

	commands.registerCommand("vp.add-template", async (args: Uri) => {
		const filePath = args.path.slice(1)
		const newTemplateName = await window.showInputBox({
			prompt: 'New template name',
		})
		if (newTemplateName === undefined) {
			return
		}
		const templates = fs.readdirSync(templateFileFolderPath).map(item => item.replace(".spec.json", ""))
		
		if (templates.includes(newTemplateName)) {
			window.showErrorMessage(`Template name ${newTemplateName} already exists`)
			return
		}

		fs.copyFileSync(filePath, path.join(`${templateFileFolderPath}/${newTemplateName}.spec.json`))
		window.showInformationMessage(`Add template ${newTemplateName} success`)
	});

	commands.registerCommand("vp.delete-template", async (args: Uri) => {
		const templates = fs.readdirSync(templateFileFolderPath).map(item => item.replace(".spec.json", ""))
		const templateName = await window.showQuickPick(templates, {
			placeHolder: "Select a template you want to delete"
		})
		if (!templateName) {
			return
		}
		
		fs.unlinkSync(path.join(templateFileFolderPath, `${templateName}.spec.json`))
		window.showInformationMessage(`The template ${templateName} deleted successfully`)
	});
	/* VP spec template end */

	/* Add key */
	commands.registerCommand("vp.add-localStorage", async (args: Uri) => {
		const key = await window.showInputBox({
			prompt: 'Key name',
			placeHolder: 'Key name'
		})
		if (key === undefined) {
			return
		}
		const value = await window.showInputBox({
			prompt: 'Value',
			placeHolder: 'Value'
		})
		if (value === undefined) {
			return
		}
		const folderPath = args.path.slice(1)
		addLocalStorage(folderPath, key, value)
		window.showInformationMessage(`LocalStorage {${key}: ${value}} added successfully`)
	});

	commands.registerCommand("vp.add-flight", async (args: Uri) => {
		const flightId = await window.showInputBox({
			prompt: 'Flight Id',
			placeHolder: "Flight Id"
		})
		if (flightId === undefined) {
			return
		}
		const folderPath = args.path.slice(1)
		addFlight(folderPath, flightId)
		window.showInformationMessage(`Flight Id ${flightId} added successfully`)
	});

	/* Add key end */
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (disposables) {
		disposables.forEach(item => item.dispose());
	}
	disposables = [];
}
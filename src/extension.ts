// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands, Disposable, window, Task, TaskScope, ShellExecution, tasks, Uri } from 'vscode';
import { CodelensProvider } from './utils/codeLensProvider';
import { getCwd } from './utils/config';

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

	languages.registerCodeLensProvider("json", codelensProvider);

	commands.registerCommand("vp.run-spec-local", (args: string[]) => {
		window.showInformationMessage(`VP local start ${args[0]}`);
		const workspacePath = getCwd()
		const filePath = args[0].split("\\visualparity-tests\\")[1].replaceAll("\\", "/")
		const npmCommand = `cd ${workspacePath};npm run test:vp -- -- --local --input '${filePath}'`
		tasks.executeTask(getRunSpecTask(npmCommand))
	});

	commands.registerCommand("vp.run-spec-online", async (args: string[]) => {
		const spalink = await window.showInputBox({
			prompt: 'Build Number',
		})
		window.showInformationMessage(`VP online ${spalink} start ${args[0]}`);
		const workspacePath = getCwd()
		const filePath = args[0].split("\\visualparity-tests\\")[1].replaceAll("\\", "/")
		const npmCommand = `cd ${workspacePath};npm run test:vp -- -- --input '${filePath}' --spalink ${spalink}`
		tasks.executeTask(getRunSpecTask(npmCommand));
	});

	commands.registerCommand("vp.debug-spec", (args: string[]) => {
		window.showInformationMessage(`VP debug ${args}`);
		const workspacePath = getCwd()
		const filePath = args[0].split("\\visualparity-tests\\")[1].replaceAll("\\", "/")
		const npmCommand = `cd ${workspacePath};npm run test:vp:debug -- -- --local --input '${filePath}'`
		tasks.executeTask(getRunSpecTask(npmCommand));
	});

	commands.registerCommand("vp.run-spec-local-folder", (args: Uri) => {
		window.showInformationMessage(`VP local start ${args.path.slice(1)}`);
		const workspacePath = getCwd()
		const filePath = args.path.split("/visualparity-tests/")[1]
		const npmCommand = `cd ${workspacePath};npm run test:vp -- -- --local --input '${filePath}'`
		tasks.executeTask(getRunSpecTask(npmCommand))
	});

	commands.registerCommand("vp.run-spec-online-folder", async (args: Uri) => {
		const spalink = await window.showInputBox({
			prompt: 'Build Number',
		})
		window.showInformationMessage(`VP online ${spalink} start ${args.path.slice(1)}`);
		const workspacePath = getCwd()
		const filePath = args.path.split("/visualparity-tests/")[1]
		const npmCommand = `cd ${workspacePath};npm run test:vp -- -- --input '${filePath}' ${spalink ? `--spalink ${spalink}` : ""}`
		tasks.executeTask(getRunSpecTask(npmCommand));
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (disposables) {
		disposables.forEach(item => item.dispose());
	}
	disposables = [];
}
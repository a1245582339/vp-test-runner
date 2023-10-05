import * as vscode from 'vscode';

/**
 * CodelensProvider
 */
export class CodelensProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor() {
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        this.codeLenses = [];
        const specRegex = new RegExp(/"tests"\s*:\s*\[/g);
        const text = document.getText();
        const filePath = document.fileName
        let matches;
        while ((matches = specRegex.exec(text)) !== null) {
            const line = document.lineAt(document.positionAt(matches.index).line);
            const indexOf = line.text.indexOf(matches[0]);
            const position = new vscode.Position(line.lineNumber, indexOf);
            const range = document.getWordRangeAtPosition(position, new RegExp(specRegex));
            if (range) {
                const args = [filePath]
                this.codeLenses.push(new vscode.CodeLens(range, {
                    title: "Run Local",
                    tooltip: "Run all case in this file",
                    command: "vp.run-spec-local",
                    arguments: [args]
                }));
                this.codeLenses.push(new vscode.CodeLens(range, {
                    title: "Run Online",
                    tooltip: "Run all case in this file",
                    command: "vp.run-spec-online",
                    arguments: [args]
                }));
                this.codeLenses.push(new vscode.CodeLens(range, {
                    title: "Debug",
                    tooltip: "Debug all case in this file",
                    command: "vp.debug-spec",
                    arguments: [args]
                }));
            }
        }

        const caseRegex = new RegExp(/"testCase"\s*:\s*\"/g);
        while ((matches = caseRegex.exec(text)) !== null) {
            const line = document.lineAt(document.positionAt(matches.index).line);
            const indexOf = line.text.indexOf(matches[0]);
            const position = new vscode.Position(line.lineNumber, indexOf);
            const range = document.getWordRangeAtPosition(position, new RegExp(caseRegex));
            if (range) {
                const line = range.start.line + 1
                const args = [filePath, line]
                this.codeLenses.push(new vscode.CodeLens(range, {
                    title: "Run Local",
                    tooltip: "Run this case",
                    command: "vp.run-case-local",
                    arguments: [args]
                }));
                this.codeLenses.push(new vscode.CodeLens(range, {
                    title: "Run Online",
                    tooltip: "Run this case",
                    command: "vp.run-case-online",
                    arguments: [args]
                }));
            }
        }
        return this.codeLenses;
    }
}


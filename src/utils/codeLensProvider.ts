import * as vscode from 'vscode';
import { getCwd } from './config';

/**
 * CodelensProvider
 */
export class CodelensProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];
    private regex: RegExp;
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor() {
        this.regex = /"tests"\s*:\s*\[/g;

        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        if (vscode.workspace.getConfiguration("vp").get("enableCodeLens", true)) {
            this.codeLenses = [];
            const regex = new RegExp(this.regex);
            const text = document.getText();
            const filePath = document.fileName
            let matches;
            while ((matches = regex.exec(text)) !== null) {
                const line = document.lineAt(document.positionAt(matches.index).line);
                const indexOf = line.text.indexOf(matches[0]);
                const position = new vscode.Position(line.lineNumber, indexOf);
                const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));
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
            return this.codeLenses;
        }
        return [];
    }
}


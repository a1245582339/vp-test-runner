import * as vscode from 'vscode';

export const getCwd = () => {
    return vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.fsPath
}
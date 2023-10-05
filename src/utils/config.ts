import * as vscode from 'vscode';

export const getCwd = () => {
    return vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.fsPath
}

export const getExtentionPath = () => {
    return vscode.extensions.getExtension("lzp.vp-test-runner")!.extensionPath
}
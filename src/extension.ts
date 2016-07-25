"use strict";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {

    console.log("Congratulations, your extension 'highlight-trailing-white-spaces' is now active!");

    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (!editor) {
            return;
        }
        updateDecorations(editor);
    }, null, context.subscriptions);

    vscode.window.onDidChangeTextEditorSelection(event => {
        if (!event.textEditor) {
            console.error("onDidChangeTextEditorSelection(" + event + "): no active text editor.");
            return;
        }
        updateDecorations(event.textEditor);
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (!vscode.window.activeTextEditor) {
            console.error("onDidChangeTextDocument(" + event + "): no active text editor.");
            return;
        }
        updateDecorations(vscode.window.activeTextEditor);
    }, null, context.subscriptions);

    let trailingSpacesDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: "rgba(255,0,0,0.3)"
    });

    function updateDecorations(activeTextEditor: vscode.TextEditor) {
        if (!activeTextEditor) {
            console.error("updateDecorations(): no active text editor.");
            return;
        }

        const regEx = /\s+$/g;
        const doc = activeTextEditor.document;
        const decorationOptions: vscode.DecorationOptions[] = [];
        for (let i = 0; i < doc.lineCount; i++) {
            let lineText = doc.lineAt(i);
            let line = lineText.text;
            if (i === activeTextEditor.selection.active.line) {
                continue;
            }

            let match;
            while (match = regEx.exec(line)) {
                let startPos = new vscode.Position(i, match.index);
                let endPos = new vscode.Position(i, match.index + match[0].length);
                const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: "Number **" + match[0] + "**"};
                decorationOptions.push(decoration);
            }
        }
        activeTextEditor.setDecorations(trailingSpacesDecorationType, decorationOptions);
    }

    updateDecorations(vscode.window.activeTextEditor);
}

export function deactivate() {
    console.log("The extension 'highlight-trailing-white-spaces' is now deactivated.");
}
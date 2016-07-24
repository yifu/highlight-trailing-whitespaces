'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "highlight-trailing-white-spaces" is now active!');

    let enableTrailingWSHlCmd = vscode.commands.registerCommand('extension.enableTrailingWSHl', () => {
        updateDecorations(vscode.window.activeTextEditor);
    });

    let trailingSpacesDecorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: 'rgba(255,0,0,0.3)'
	});

	function updateDecorations(activeTextEditor: vscode.TextEditor) {
		if (!activeTextEditor) {
			console.error("updateDecorations(): no active text editor.");
			return;
		}

		var regEx = /\s+$/g;
		let doc = activeTextEditor.document;
		var decorationOptions : vscode.DecorationOptions[] = [];
		for (let i = 0; i < doc.lineCount; i++) {
			let lineText = doc.lineAt(i);
			let line = lineText.text;
			if (i == activeTextEditor.selection.active.line || lineText.isEmptyOrWhitespace) {
				continue;
			}

			var match;
			while (match = regEx.exec(line)) {
				let startPos = new vscode.Position(i, match.index);
				let endPos = new vscode.Position(i, match.index + match[0].length);
				var decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**'};
				decorationOptions.push(decoration);
			}
		}
		activeTextEditor.setDecorations(trailingSpacesDecorationType, decorationOptions);
	}
    context.subscriptions.push(enableTrailingWSHlCmd);
}

export function deactivate() {
	console.log('The extension "highlight-trailing-white-spaces" is now disabled.');
}
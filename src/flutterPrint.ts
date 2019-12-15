import { workspace, WorkspaceEdit, window, commands, Range, Uri, TextEditorEdit, TextEditor, WorkspaceConfiguration } from "vscode";

export class FlutterPrint {
  config: WorkspaceConfiguration = workspace.getConfiguration("flutterPrintTools");
  constructor() {
    workspace.onDidChangeConfiguration(() => (this.config = workspace.getConfiguration("flutterPrintTools")));
  }

  public insert = (): void => {
    if (!window.activeTextEditor) {
      return;
    }

    const selectedText = window.activeTextEditor.document.getText(window.activeTextEditor.selection).trim();

    if (selectedText) {
      commands.executeCommand("editor.action.insertLineAfter").then(() => {
        if (this.config.get<boolean>("debugPrint", false)) {
          const wrapWidth = this.config.get<number>("debugPrintWrapWidth", 1024);
          const textToInsert = `debugPrint('${selectedText.toUpperCase()}: \${${selectedText}}'${
            wrapWidth === 0 ? "" : ", wrapWidth: " + wrapWidth
          });`;
          this.insertStatement(textToInsert);
        } else {
          const textToInsert = `print('${selectedText.toUpperCase()}: \${${selectedText}}');`;
          this.insertStatement(textToInsert);
        }
      });
    } else {
      if (this.config.get<boolean>("debugPrint")) {
        const wrapWidth = this.config.get<number>("debugPrintWrapWidth");
        const textToInsert = `debugPrint( ${wrapWidth === 0 ? "" : ", wrapWidth: " + wrapWidth});`;
        this.insertStatement(textToInsert);
      } else {
        this.insertStatement("print();");
      }
    }
  };

  public remove = (): void => {
    const editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    const printStatements = this.getAllPrintStatements(editor);

    if (printStatements.length === 0) {
      window.showInformationMessage(`No print statements found.`);
      return;
    } else {
      if (this.config.get<boolean>("skipWarning", false)) {
        this.deleteFoundPrintStatements(editor, editor.document.uri, printStatements);
      } else {
        this.showWarning().then((result: boolean) => {
          if (result) {
            this.deleteFoundPrintStatements(editor, editor.document.uri, printStatements);
          } else {
            return;
          }
        });
      }
    }
  };

  private insertStatement = (val: string): void => {
    const editor = window.activeTextEditor;

    if (!editor) {
      window.showErrorMessage("Can't insert log because no document is open");
      return;
    }

    const range = new Range(editor.selection.start, editor.selection.end);

    editor.edit(editBuilder => editBuilder.replace(range, val));
  };

  private getAllPrintStatements = (editor: TextEditor): Range[] => {
    const statements = [];

    const printRegEx = /(print|debugPrint)\((.*)\);?/g;
    let match: RegExpExecArray | null;
    while ((match = printRegEx.exec(editor.document.getText()))) {
      let matchRange = new Range(editor.document.positionAt(match.index), editor.document.positionAt(match.index + match[0].length));
      if (!matchRange.isEmpty) {
        statements.push(matchRange);
      }
    }
    return statements;
  };

  private deleteFoundPrintStatements = (editor: TextEditor, docUri: Uri, statements: Range[]): void => {
    const deleteEmpty = this.config.get<boolean>("deleteEmptyLine", true);
    const workspaceEdit = new WorkspaceEdit();

    editor.edit((edit: TextEditorEdit) => {
      statements.forEach(range => {
        workspaceEdit.delete(docUri, range);
        if (deleteEmpty) {
          const line = editor.document.lineAt(range.start);
          edit.delete(line.rangeIncludingLineBreak);
        }
      });
    });

    workspace.applyEdit(workspaceEdit).then(() => {
      statements.length > 1
        ? window.showInformationMessage(`${statements.length} print statements deleted!`)
        : window.showInformationMessage(`${statements.length} print statement deleted!`);
    });
  };

  private showWarning = async (): Promise<boolean> => {
    const response = await window.showWarningMessage(
      "This will remove all 'print()' and 'debugPrint()' statements throughout the current file. Do you want to continue?",
      "Yes, I understand!"
    );

    return response === "Yes, I understand!" ? Promise.resolve(true) : Promise.resolve(false);
  };
}

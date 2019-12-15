import { ExtensionContext, commands } from "vscode";
import { FlutterPrint } from "./flutterPrint";

const print = new FlutterPrint();

export function activate(context: ExtensionContext): void {
  const insert = commands.registerCommand("flutter-print-tools.insertPrint", () => print.insert());
  const remove = commands.registerCommand("flutter-print-tools.removePrint", () => print.remove());

  context.subscriptions.push(insert, remove);
}

export function deactivate(): void {}

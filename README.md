# Flutter Print Tools

![banner](assets/banner.png)

🤖 Easily add/remove 'print' statements to your code.

## Usage

### **Insert print statement** command:

Highlight a variable and press `ctrl(cmd)+shift+i` to add a print statement with that variable to **new** line. If you don't select any variable, the command will generate empty print statemend on the **same** line.

### **Remove print statement** command:

Press `ctrl(cmd)+shift+i` to remove all print statements from your code.

> **Tip**: Check out the settigns to configure the extension further.

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Keybindings

These are the default keybindings, you can change them to suit your needs.

| Linux, Windows | macOS       | Command                |
| -------------- | ----------- | ---------------------- |
| ctrl+shift+i   | cmd+shift+i | Insert print statement |
| ctrl+shift+r   | cmd+shift+r | Remove print statement |

## Extension Settings

This extension contributes the following settings:

- `flutterPrintTools.debugPrint`: use `debugPrint()` command instead of `print()`
- `flutterPrintTools.debugPrintWrapWidth`: set this to `0` for default. Used only if `flutterPrintTools.debugPrint` is **enabled**
- `flutterPrintTools.deleteEmptyLine`: Delete empty lines after removing print statements
- `flutterPrintTools.skipWarning`: Skip the warning message when using the `Remove all print statements` command

## Known Issues

None.

## For more information

- [print() function](https://api.flutter.dev/flutter/dart-core/print.html)
- [debugPrint() function](https://api.flutter.dev/flutter/foundation/debugPrint.html)

**Enjoy!**

# marscode

## Features
It is recommended to use this extension in conjunction with one of the many available extensions for MIPS Assembly syntax highlighting and snippets.

- [MIPS Support](https://marketplace.visualstudio.com/items?itemName=kdarkhan.mips)
- [Better MIPS Support](https://marketplace.visualstudio.com/items?itemName=vasilescur.better-mips)

When a MIPS ASM file is open, you can press `Ctrl+Shift+P` (to open the command palette) then run the Assemble and Run command.
Alternatively, you may have a more complex use case (like passing program arguments), and for this you can open a terminal, 
then run the "Inject MARS Command" command, which will provide a stub that you can add your program arguments / options to.

## Requirements
Java is required to run the MARS IDE, so the JRE8 `bin` directory must be in the system `PATH` environment variable.

## Extension Settings

This extension contributes the following settings:

* `marscode.marsJAR`: (optional) the path to a MARS IDE JAR file, intended for custom versions of the IDE

## Release Notes

### 1.2.0
Add the "Run with Bitmap Display" command.

### 1.1.0
Add the "Inject MARS command" command. That one's a mouthful.

### 1.0.0

Initial release of the MARS extension

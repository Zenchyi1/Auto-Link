import { Editor } from "obsidian";

class Helper {
    private isYaml(editor: Editor, line: number) {
        if (editor.getLine(0) !== "---") {
            return false;
        } else {
            const cursorLine = line - 1;
            for (let i = cursorLine; i > 0; i--) {
                if (editor.getLine(i) === "---") {
                    return false;
                }

            }
            return true;
        }

    }

    private isCodeBlock(editor: Editor, line:number) {
        for (let i = line; i > 0; i--) {
            if (editor.getLine(i).includes("```")) {
                for (let j = line; j < editor.lastLine(); j++) {
                    if (editor.getLine(j).includes("```")) {
                        return true;
                    }
                }
            }
        } return false; // Cant be in code block because no code block exists
    }

    public inBlock(editor: Editor, line:number): boolean { return this.isCodeBlock(editor, line) || this.isYaml(editor, line) }
}

export const helper = new Helper();
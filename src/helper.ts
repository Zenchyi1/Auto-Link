import { Editor } from "obsidian";
class Helper {
    private isYaml(editor: Editor) {
        if (editor.getLine(0) !== "---") {
            return false;
        } else {
            const cursorLine = editor.getCursor().line - 1;
            for (let i = cursorLine; i > 0; i--) {
                if (editor.getLine(i) === "---") {
                    return false;
                }

            }
            return true;
        }

    }

    private isCodeBlock(editor: Editor) {
        for (let i = editor.getCursor().line; i > 0; i--) {
            if (editor.getLine(i).includes("```")) {
                for (let j = editor.getCursor().line; j < editor.lastLine(); j++) {
                    if (editor.getLine(j).includes("```")) {
                        return true;
                    }
                }
            }
        } return false; // Cant be in code block because no code block exists
    }

    public inBlock(editor: Editor): boolean { return this.isCodeBlock(editor) || this.isYaml(editor) }
}

export const helper = new Helper();
import { TFile, MarkdownView } from "obsidian";
import { file_handler } from "src/file_handler";
import { helper } from "./helper";
import { linkSettings } from "./settings";
export class insertLinks {
    private view: any = app.workspace.getActiveViewOfType(MarkdownView)
    public search(settings: linkSettings) {
        if (helper.inBlock(this.view.editor)) { return; } // return if in code block or yaml
        const cursorLine: number = this.view?.editor.getCursor().line;
        let lineCount: number = cursorLine - 3;
        if (cursorLine < 3) {
            lineCount = 0;
        }
        for (let i = cursorLine; i > (lineCount - 1); i--) {
            const line: string = this.view.editor.getLine(i);
            for (const [key, value] of file_handler.filenames) {
                this.check_and_insert_link(line, key + " ", i, value, settings.ignoreCase);
            }
        }
    }

    private check_and_insert_link(line: string, v: string, i: number, file: TFile, ignoreCase: boolean) {
        if (!ignoreCase) {
            if (line.includes(v)) {
                const alias: boolean = ((file.basename.toLowerCase() === v.toLowerCase().slice(0, -1)) ? false : true);
                const view = app.workspace.getActiveViewOfType(MarkdownView);
                const re = new RegExp(v, 'g');
                let newStr = "";
                if (alias) {
                    newStr = line.replace(re, "[[" + file.basename + "|" + v.slice(0, -1) + "]] ");
                } else {
                    newStr = line.replace(re, "[[" + v.slice(0, -1) + "]] ");
                }
                view?.editor.setLine(i, newStr);
            }
        } else {
            if (line.toLowerCase().includes(v.toLocaleLowerCase())) {
                const start = line.toLowerCase().indexOf(v.toLocaleLowerCase());
                const end = start + v.length;
                const word = line.substring(start, end);
                const alias: boolean = ((file.basename.toLowerCase() === v.toLowerCase().slice(0, -1)) ? false : true);
                const view = app.workspace.getActiveViewOfType(MarkdownView);
                const re = new RegExp(word, 'g');
                let newStr = "";
                if (alias) {
                    newStr = line.replace(re, "[[" + file.basename + "|" + word.slice(0, -1) + "]] ");
                } else {
                    newStr = line.replace(re, "[[" + word.slice(0, -1) + "]] ");
                }
                view?.editor.setLine(i, newStr);
            }
        }
        return;
    }
}
export const insert_links = new insertLinks();
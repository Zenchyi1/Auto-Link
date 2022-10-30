import { TFile, MarkdownView } from "obsidian";

export function checkAndReplace(line: string, v: string, i: number, file: TFile) {
    if (line.includes(v)) {
        let alias: boolean;
        if (file.basename != v) {
            alias = true;
        } else { alias = false }

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
    return;

}
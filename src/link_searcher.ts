import { TFile, MarkdownView } from "obsidian";

export function checkAndReplace(line: string, v: string, i: number, file: TFile, case_sensitive: boolean) {
    if (case_sensitive) {
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
    } else {
        if (line.toLowerCase().includes(v.toLocaleLowerCase())) {
            const start = line.toLowerCase().indexOf(v.toLocaleLowerCase());
            const end = start + v.length;
            const word = line.substring(start, end);
            console.log(word);
            console.log('found ' + v + ' in line ' + i);
            let alias: boolean;
            if (file.basename.toLowerCase() != v) {
                alias = true;
            } else { alias = false }

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
import { MarkdownView } from "obsidian";
import { file_handler } from "src/file_handler";
import { helper } from "src/helper";
import { insert_links } from "src/insertLinks";
import { linkSettings } from "src/settings";
import { scanner } from "./scanner";

class Modify extends scanner {
    public search(settings: linkSettings) {
        const view: any = app.workspace.getActiveViewOfType(MarkdownView)
        if (helper.inBlock(view.editor)) { return; } // return if in code block or yaml
        const cursorLine: number = view?.editor.getCursor().line;
        let lineCount: number = cursorLine - 3;
        if (cursorLine < 3) {
            lineCount = 0;
        }
        for (let i = cursorLine; i > (lineCount - 1); i--) {
            const line: string = view.editor.getLine(i);
            for (const [key, value] of file_handler.filenames) {
                insert_links.check_and_insert_link(line, key + " ", i, value, settings.ignoreCase);
            }
        }
    }

    public setup(plugin: any): void {
        plugin.registerEvent(plugin.app.vault.on('modify', () => {
            this.search(plugin.settings);
        }));
    }

}
export const modify = new Modify(); 
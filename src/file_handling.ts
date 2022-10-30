import { TAbstractFile, TFile } from "obsidian";
export const filesNames = new Map<string, TFile>();

export function printFiles() {
    console.log([...filesNames.entries()]);

}

export function removeFile(file: TAbstractFile) {
    for (const [key, value] of filesNames) {
        if (value == file) { filesNames.delete(key) }
    }
}


function addFile(file: TFile, alias: boolean) {
    filesNames.set(file.basename, file);
    if (alias) {
        const data = app.metadataCache.getFileCache(file);
        if (!(data?.frontmatter == undefined)) {
            if (!(data.frontmatter.aliases == undefined)) {// dont ask
                for (const alias of data.frontmatter.aliases) {
                    filesNames.set(alias, file);

                }
            }
        }
    }
}

export async function retrieveFileNames(alias: boolean) {
    filesNames.clear();
    await new Promise(resolve => setTimeout(resolve, 5000)); // not pretty, needs a fix
    const files = app.vault.getMarkdownFiles();
    for (let i = 0; i < files.length; i++) {
        addFile(files[i], alias);
    }
}



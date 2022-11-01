import { TAbstractFile, TFile } from "obsidian";

class fileHandler {
    public filenames = new Map<string, TFile>();

    public removeFile(file: TAbstractFile) {
        for (const [key, value] of this.filenames) {
            if (value == file) { this.filenames.delete(key) }
        }
    }

    public printFiles() {
        console.log([...this.filenames.entries()]);

    }

    private addFile(file: TFile, alias: boolean) {
        this.filenames.set(file.basename, file);
        if (alias) {
            const data = app.metadataCache.getFileCache(file);
            if (!(data?.frontmatter == undefined)) {
                if (!(data.frontmatter.aliases == undefined)) {// dont ask
                    for (const alias of data.frontmatter.aliases) {
                        this.filenames.set(alias, file);

                    }
                }
            }
        }
    }



    public async retrieveFileNames(alias: boolean) {
        this.filenames.clear();
        const files = app.vault.getMarkdownFiles();
        for (let i = 0; i < files.length; i++) {
            this.addFile(files[i], alias);
        }

    }

}
export const file_handler = new fileHandler(); 
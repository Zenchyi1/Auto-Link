import { TFile } from "obsidian";

class fileHandler {
    public filenames = new Map<string, TFile>();

    public removeFile(file: any) {
        for (const [key, value] of this.filenames) {
            if (value == file) { this.filenames.delete(key) }
        }
    }

    public renameFile(file: TFile, path: string, plugin: any) {
        for (const value of this.filenames.values()) {
            if (value == file) { this.removeFile(file) }
        }
        this.addFile(file, plugin.settings.addAlias);
    }



    public printFiles() {
        console.log([...this.filenames.entries()]);

    }

    private addFile(file: TFile, alias: boolean) {
        this.filenames.set(file.basename, file);
        if (alias) {
            const data = app.metadataCache.getFileCache(file);
            if (!(data?.frontmatter == undefined)) {
                if (!(data.frontmatter.aliases == undefined)) {
                    if(typeof(data.frontmatter.aliases) == "string"){
                        const aliasArr = data.frontmatter.aliases.split(",");
                        for(const alias of aliasArr){
                            this.filenames.set(alias.trim(), file);
                        }
                    }else{
                    for (const alias of data.frontmatter.aliases) {
                        this.filenames.set(alias, file);
                    }
                    
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
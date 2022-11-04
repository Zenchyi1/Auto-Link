import { file_handler } from './file_handler';
import { TFile } from 'obsidian';
import { scanner } from './link_scanner/scanner';
import { modify } from './link_scanner/modify';
import { file_closed } from './link_scanner/file_closed';
class eventManager {
    public link_scanner: scanner;
    public setup(plugin: any) {
        this.link_scanner.setup(plugin); // TODO: undo the setup when updated 
        plugin.registerEvent(plugin.app.vault.on('delete', (file: TFile) => {
            file_handler.removeFile(file);
        }));

        plugin.registerEvent(plugin.app.vault.on('rename', (file: TFile, path: string) => {
            file_handler.renameFile(file, path, plugin);
        }));
    }
    public setScanner(scanner_mode: string) {
        switch (scanner_mode) {
            case "modify":
                this.link_scanner = modify;
                break;
            case "file_close":
                this.link_scanner = file_closed;
                break;
            default:
                this.link_scanner = modify;
                break;
        }
    }
}
export const event_manager = new eventManager();
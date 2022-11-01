import { insert_links } from './insertLinks';
import { file_handler } from './file_handler';
import { TFile } from 'obsidian';

class eventManager {
    public setup(plugin: any) {
        plugin.registerEvent(plugin.app.vault.on('modify', () => {
            insert_links.search(plugin.settings);
        }));

        plugin.registerEvent(plugin.app.vault.on('delete', (file: TFile) => {
            file_handler.removeFile(file);
        }));

        plugin.registerEvent(plugin.app.vault.on('rename', (file: TFile, path: string) => {
            file_handler.renameFile(file, path, plugin);
        }));
    }
}
export const event_manager = new eventManager();
import { Plugin } from 'obsidian';
import { linkSettings, DEFAULT_SETTINGS } from './settings';
import linkSettingsTab from './settings_tab';
import { insert_links } from './insertLinks';
import { file_handler } from './file_handler';
export default class autoLink extends Plugin {
    settings: linkSettings;

    async onload() {
        await this.loadSettings();
        this.registerEvent(this.app.vault.on('modify', () => {
            insert_links.search(this.settings);
        }));

        this.registerEvent(this.app.vault.on('delete', (file) => {
            file_handler.removeFile(file);
        }));


        this.addCommand({
            id: 'getArray',
            name: 'getArray',
            callback: () => {
                file_handler.printFiles();
            }
        });
        this.app.workspace.onLayoutReady(() => file_handler.retrieveFileNames(this.settings.addAlias));
        this.addSettingTab(new linkSettingsTab(this.app, this));

    }
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
}




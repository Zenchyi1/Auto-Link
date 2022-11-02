import { Plugin } from 'obsidian';
import { linkSettings, DEFAULT_SETTINGS } from './settings';
import linkSettingsTab from './settings_tab';
import { file_handler } from './file_handler';
import { event_manager } from './event_manager';

export default class autoLink extends Plugin {
    settings: linkSettings;

    async onload() {
        await this.loadSettings();
        event_manager.setup(this);


        this.addCommand({
            id: 'getArray',
            name: 'getArray',
            callback: () => {
                file_handler.printFiles();
            }
        });

        this.app.workspace.onLayoutReady(() => file_handler.retrieveFileNames(this.settings.addAlias)); // wait until files are loaded
        this.addSettingTab(new linkSettingsTab(this.app, this));

    }
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
}




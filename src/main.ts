import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

import {
	retrieveFileNames,
	printFiles,
	removeFile,
	filesNames
} from './file_handling';

import {
	checkAndReplace
}
	from './link_searcher';

interface PluginSettings {
	Settings: string;
	useAlias: boolean;
	case_sensitive: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
	Settings: 'default',
	useAlias: true,
	case_sensitive: false
}

export default class autoLink extends Plugin {


	settings: Setting;
	async onload() {
		await this.loadSettings();



		this.registerEvent(this.app.vault.on('modify', () => {
			// check for new links
			const view: any = this.app.workspace.getActiveViewOfType(MarkdownView);
			const cursorLine: number = view?.editor.getCursor().line;
			let lineCount: number = cursorLine - 3;
			if (cursorLine < 3) {
				lineCount = 0;
			}
			for (let i = cursorLine; i > (lineCount - 1); i--) {
				const line: string = view.editor.getLine(i);
				for (const [key, value] of filesNames) {
					checkAndReplace(line, key + " ", i, value, this.settings.case_sensitive);
				}
			}
		}));

		this.registerEvent(this.app.vault.on('rename', (file, oldpath) => {
			//nothing for now  
		}));

		//delete file from array when it gets removed
		this.registerEvent(this.app.vault.on('delete', (file) => {
			removeFile(file);
		}));

		this.addCommand({
			id: 'getArray',
			name: 'getArray',
			callback: () => {
				printFiles();
			}
		});


		this.addSettingTab(new SettingTab(this.app, this));
		retrieveFileNames(this.settings.useAlias);
	}

	onunload() {
		//shouldn't need to unload anything
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}



}
class SettingTab extends PluginSettingTab {
	plugin: autoLink;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings.' });

		new Setting(containerEl)
			.setName('Alias')
			.setDesc('whether or not to link and scan aliases. Doing so may result in lag on large Vaults')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.useAlias)
					.onChange(async (value) => {
						this.plugin.settings.useAlias = value;
						retrieveFileNames(value);
						await this.plugin.saveSettings();
					}),
			);
		new Setting(containerEl)
			.setName('Case Sensitivity')
			.setDesc('Considers Case when searching for links')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.case_sensitive)
					.onChange(async (value) => {
						this.plugin.settings.case_sensitive = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}



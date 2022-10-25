import { App, MarkdownView, Plugin, TFile, PluginSettingTab, Setting } from 'obsidian';

interface PluginSettings {
	Settings: string;
	useAlias: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
	Settings: 'default',
	useAlias: true
}

export default class autoLink extends Plugin {
	private filesNames = [];
	settings: Setting;
	async onload() {
		await this.loadSettings();

		this.retrieveFileNames();
		//check for any new links
		this.registerEvent(this.app.vault.on('modify', () => {
			const view: any = this.app.workspace.getActiveViewOfType(MarkdownView);
			const cursorLine: number = view?.editor.getCursor().line;
			let lineCount = cursorLine - 5;
			if (cursorLine < 5) {
				lineCount = 0;
			}
			for (let i = cursorLine; i > lineCount; i--) { // checking last 5 lines since i assume no one can write that much within one save, might make problems with copypasted text
				const line: string = view.editor.getLine(i);
				this.filesNames.some(v => this.checkAndReplace(line, v.title, i, v))
			}
		}));

		//add file to fileArray when renamed (onCreate will only give the default name like "untitled")
		this.registerEvent(this.app.vault.on('rename', (file) => {
			this.filesNames.push(file.basename + " ");
		}));

		//delete file from array when it gets removed
		this.registerEvent(this.app.vault.on('delete', (file) => {
			const index = this.filesNames.indexOf(file.basename + " "); // not quite good since two files could have the same name, but thatd make problems with the linking anyway 
			if (index != -1) {//check if files exists in array
				this.filesNames.splice(index, 1);
			}

		}));

		this.addCommand({
			id: 'getArray',
			name: 'getArray',
			callback: () => {
				console.log("aliases: " + this.settings.useAlias);
				console.log(this.filesNames);

			}
		});


		this.addSettingTab(new SettingTab(this.app, this));

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

	private addFile(file, title: string) {
		this.filesNames.push({ "title": title + " ", "isAlias": false });
		if(this.settings.useAlias){
		const data = this.app.metadataCache.getFileCache(file);
		if (!(data.frontmatter == undefined)) {
			if (!(data.frontmatter.aliases == undefined)) {// dont ask
				for (const alias of data.frontmatter.aliases) {
					const obj = {
						"title": alias + " ",
						"isAlias": true,
						"originalTitle": title
					}
					this.filesNames.push(obj);
				}
			}
		}
	}

	}

	private checkAndReplace(line: string, v: string, i: number, info: object) {

		if (line.includes(v)) {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			const re = new RegExp(v, 'g');
			let newStr = "";
			if (info.isAlias) {
				newStr = line.replace(re, "[[" + info.originalTitle + "|" + v.slice(0, -1) + "]] ");
			} else {
				newStr = line.replace(re, "[[" + v.slice(0, -1) + "]] ");
			}
			view?.editor.setLine(i, newStr);
		}
		return;

	}
	private retrieveFileNames() {
		const files = this.app.vault.getMarkdownFiles();
		for (let i = 0; i < files.length; i++) {
			this.addFile(files[i], files[i].basename);
		}
	}
}
class SettingTab extends PluginSettingTab {
	plugin: autoLink;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings.'});

		new Setting(containerEl)
			.setName('Alias')
			.setDesc('whether or not to link and scan aliases. Doing so may result in lag on large Vaults')
			.addToggle((toggle) =>
			toggle
			  .setValue(this.plugin.settings.useAlias)
			  .onChange(async (value) => {
				this.plugin.settings.useAlias = value;
				await this.plugin.saveSettings();
			  }),
		  );
	}
}



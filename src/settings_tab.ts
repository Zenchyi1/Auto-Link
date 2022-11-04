import { App, PluginSettingTab, Setting } from "obsidian";
import autoLink from "./main";
import { file_handler } from "./file_handler";
import { event_manager } from "./event_manager";
export default class linkSettingsTab extends PluginSettingTab {
    private plugin: autoLink;


    constructor(app: App, plugin: autoLink) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): any {
        const { containerEl } = this;

        containerEl.empty();


        new Setting(containerEl)
            .setName("Ignore Case Sensitive")
            .setDesc("Whether or not to ignore Case sensitivity when searching for links")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.ignoreCase)
                .onChange(async val => {
                    this.plugin.settings.ignoreCase = val;
                    await this.plugin.saveSettings();
                }));
        new Setting(containerEl)
            .setName("Include Alias")
            .setDesc("Whether or not to link Aliases")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.addAlias)
                .onChange(async val => {
                    this.plugin.settings.addAlias = val;
                    file_handler.retrieveFileNames(val);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Scanner mode")//place holder for now
            .setDesc("When to search for new Links")
            .addDropdown(dropdown => dropdown
                .addOption("modify", "On Modify")
                .addOption("file_closed", "On file closed")
                .setValue("modify")
                .onChange(async val => {
                    this.plugin.settings.scanning_mode = val;
                    event_manager.setScanner(val);
                    await this.plugin.saveSettings();
                })
            );
    }
}
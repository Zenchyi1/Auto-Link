import { MarkdownView, Plugin, } from 'obsidian';


export default class autoLink extends Plugin {
	private filesNames = [];
	onload() {
		this.retrieveFileNames();
		//check for any new links
		this.registerEvent(this.app.vault.on('modify', () => {
			const view: any = this.app.workspace.getActiveViewOfType(MarkdownView);
			let lineCount: number = view?.editor.getCursor().line;
			if ((lineCount - 5) < 1) {
				lineCount = 5
			}
			for (let i = lineCount; i > lineCount - 5; i--) { // checking last 5 lines since i assume no one can write that much within one save, might make problems with copypasted text
				const line: string = view.editor.getLine(i);
				console.log(i);
				this.filesNames.some(v => this.checkAndReplace(line, v, i))
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


		// }
		// just for development 
		// 	this.addCommand({
		// 		id: 'getArray',
		// 		name: 'getArray',
		// 		callback: () => {
		// 			console.log(this.filesNames);
		// 		}
		// 	});
		// }

	}
	onunload() {
	}

	private checkAndReplace(line: string, v: string, i: number) {
		if (line.includes(v)) {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			const re = new RegExp(v, 'g');
			const newStr = line.replace(re, "[[" + v.slice(0, -1) + "]] ");
			view?.editor.setLine(i, newStr);
		}
		return;

	}
	private retrieveFileNames() {
		const files = this.app.vault.getMarkdownFiles();
		for (let i = 0; i < files.length; i++) {
			this.filesNames.push(files[i].basename + " ");
			//Space is added to differentiate between non linked and linked words,
			//  as linked words would have a ] right after, i did this to avoid checking 
			//  for already existing links during every check as this would add complexity which is
			//  really not needed
		}
	}
}


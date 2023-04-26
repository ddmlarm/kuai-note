
export function FolderHTML(folder) {
	let HTML =
		`<index-folder id="${folder.indexID}">
			<expand-folder id="${folder.indexID}-expand">&#129171</expand-folder>
			<filter-folder id="${folder.indexID}-filter">${folder.folderName}</filter-folder>
		</index-folder>`
	return HTML;
}

export function NoteHTML(note) {
	let noteTagsHTML = NoteTagsHTML(note)
	let HTML =
		`<index-note id="${note.indexID}">
			<note-details>
				<note-title>${note.title}</note-title>
				<note-folder>${note.folderName}</note-folder>
			</note-details>
			<note-tags>
				${noteTagsHTML}
			</note-tags>
			<note-date>${note.date}</note-date>
		</index-note> `
	return HTML;
}

export function NoteTagsHTML(note) {
	let noteTagHTML = [];

	try {
		note["tags"].forEach(tagID => {
			noteTagHTML.push(`<note-tag>${tagID}</note-tag>`);
		});
	}
	catch (error) { }

	return noteTagHTML.join("\n");
}

export function TagHTML(indexID) {
	let HTML = `<index-tag id="${indexID}"> ${indexID}</index-tag>`
	return HTML;
}

export function FolderContextHTML() {
	let HTML =
		`<element id="folder-context">
			<menu-option id="new-folder">
				<img src="../src/assets/images.png">
				<option-label>New Folder</option-label>
			</menu-option>
			<menu-option id="new-note">
				<img src="../src/assets/images.png">
				<option-label>New Note</option-label>
			</menu-option>
			<menu-option id="move-folder">
				<img src="../src/assets/images.png">
				<option-label>Move to</option-label>
			</menu-option>
			<menu-option id="rename-folder">
				<img src="../src/assets/images.png">
				<option-label>Rename</option-label>
			</menu-option>
			<menu-option id="delete-folder">
				<img src="../src/assets/images.png">
				<option-label>Delete</option-label>
			</menu-option>
		</element>`
	return HTML;
}

export function noteContextHTML() {
	let HTML =
		`<element id="note-context">
			<menu-option id="open-note">
				<img src="../src/assets/images.png">
				<option-label>Open</option-label>
			</menu-option>
			<menu-option id="note-preview">
				<img src="../src/assets/images.png">
				<option-label>Preview</option-label>
			</menu-option>
			<menu-option id="move-note">
				<img src="../src/assets/images.png">
				<option-label>Move to</option-label>
			</menu-option>
			<menu-option id="note-details">
				<img src="../src/assets/images.png">
				<option-label>Edit Details</option-label>
			</menu-option>
			<menu-option id="note-download">
				<img src="../src/assets/images.png">
				<option-label>Download</option-label>
			</menu-option>
			<delete-option id="delete-note">
				<img src="../src/assets/images.png">
				<option-label>Delete</option-label>
			</delete-option>
		</element>`
	return HTML;
}
import * as html from './modules/html.js';
import * as json from './modules/json.js';
import * as objects from './modules/objects.js';

////////////////////
// HTML INTERFACE //
////////////////////

// Index Explorer
const indexExplorer = document.getElementById("index-explorer-panel");
const newFolderBtn = document.getElementById("new-folder-btn");
const newNoteBtn = document.getElementById("new-note-btn");
const indexFolders = document.getElementById("index-folders");

// Index Search Bar
const searchOptions = document.getElementById("search-options");
const searchBar = document.getElementById("search-bar");
const searchInput = document.querySelector("search-input");
const searchSuggestions = document.getElementById("search-suggestions");

// Index Search Options
const sortNotesBtn = document.getElementById("sort-notes");
const notesViewBtn = document.getElementById("notes-view");

// Index Tags
const indexTags = document.getElementById("index-tags");

// Index Notes
const indexNotes = document.getElementById("index-notes");

///////////////////////
// RUNTIME VARIABLES //
///////////////////////

let selectedIndexFolderID = "root";
let selectedIndexTags = [];
let popupElementID = "";

// 
// 
// 

newFolderBtn.addEventListener("click", function () {
	createNewFolder();
});

function createNewFolder() {
	try {
		// TODO
		// Open Create Folder Form
		// Update JSON with successfully created folder
		// Update HTML with folder 

		let folder = new objects.Folder(selectedIndexFolderID);
		json.insertIndexFolder(folder);
		loadFolderHTML(folder);
	}
	catch (error) {
		console.log(error);
	}
}

newNoteBtn.addEventListener("click", function () {
	createNewNote();
});

function createNewNote() {
	try {
		// TODO
		// Open Create Note Form
		// Update JSON with successfully created note
		// Update HTML with note 

		let note = new objects.Folder(selectedIndexFolderID);
		json.insertIndexNote(note);
		loadNoteHTML(note);
	}
	catch (error) {
		console.log("ERROR: ", error);
	}

}

/////////////////////
// LOAD INDEX DATA //
/////////////////////

function loadIndexData() {
	try {
		// FOLDERS
		json.root[json.FOLDERS].forEach(folderID => {
			loadFolderHTML(json.folders[folderID]);
		});

		// NOTES
		json.root[json.NOTES].forEach(noteID => {
			loadNoteHTML(json.notes[noteID]);
		});

		// TAGS
		json.root[json.TAGS].forEach(tagID => {
			loadTagHTML(json.tags[tagID]);
		});
	}
	catch (error) { }
}

////////////////////////
// LOAD INDEX FOLDERS //
////////////////////////

function loadFolderHTML(folder) {
	try {
		let HTML = html.FolderHTML(folder);

		let siblingFolderElements = indexFolders.querySelectorAll(`[data-parentFolderID="${folder.parentFolderID}"]`);
		let dataLevel = 0;

		if (folder.parentFolderID == "root") {
			if (siblingFolderElements.length == 0) {
				indexFolders.insertAdjacentHTML("afterbegin", HTML);
			}
			else if (siblingFolderElements.length == 1) {
				let siblingFolderElement = siblingFolderElements[0];
				let siblingFolderName = siblingFolderElement.getAttribute("data-folderName");

				if (siblingFolderName.localeCompare(folder.folderName) < 0) {
					siblingFolderElement.insertAdjacentHTML("afterend", HTML);
				}
				else {
					siblingFolderElement.insertAdjacentHTML("beforebegin", HTML);
				}
			}
			else {
				let insertAfterElement = null;

				siblingFolderElements.forEach(siblingFolderElement => {
					let siblingFolderName = siblingFolderElement.getAttribute("data-folderName");

					if (siblingFolderName.localeCompare(folder.folderName) < 0) {
						insertAfterElement = siblingFolderElement;
					}
				});

				if (insertAfterElement == null) {
					indexFolders.insertAdjacentHTML("afterbegin", HTML);
				}
				else {
					insertAfterElement.insertAdjacentHTML("afterend", HTML);
				}
			}
		}
		else {
			let parentFolderElement = document.getElementById(folder.parentFolderID);
			dataLevel = parseInt(parentFolderElement.getAttribute("data-level")) + 1;

			let insertAfterElement = parentFolderElement;
			siblingFolderElements.forEach(siblingFolderElement => {
				let siblingFolderName = siblingFolderElement.getAttribute("data-folderName");
				if (siblingFolderName.localeCompare(folder.folderName) < 0) {
					insertAfterElement = siblingFolderElement;
				}
			});

			insertAfterElement.insertAdjacentHTML("afterend", HTML);

			document.getElementById(folder.indexID).style.marginLeft = `${dataLevel * 10}px`;
			document.getElementById(folder.indexID).classList.toggle("hidden");
		}

		let folderElement = document.getElementById(folder.indexID);
		folderElement.setAttribute("data-level", dataLevel);
		folderElement.setAttribute("data-folderName", folder.folderName);
		folderElement.setAttribute("data-parentFolderID", folder.parentFolderID)

		let nestedFolderIDs = []
		let childFolderIDs = []

		folder[json.FOLDERS].forEach(childFolderID => {
			nestedFolderIDs.push(childFolderID);
			childFolderIDs.push(childFolderID);

			loadFolderHTML(json.folders[childFolderID]).forEach(nestedFolderID => {
				nestedFolderIDs.push(nestedFolderID);
			});
		});

		expandFolderOnClick(folder.indexID, childFolderIDs, nestedFolderIDs);
		selectFolderOnClick(folder.indexID);
		contextFolderOnRightClick(folder.indexID);

		return nestedFolderIDs;
	}
	catch (error) {
		console.log(error);
		return null;
	}
}

function expandFolderOnClick(folderID, childFolderIDs, nestedFolderIDs) {
	document.getElementById(`${folderID}-expand`).addEventListener("click", (e) => {
		let hidden = false;

		for (let childFolderID of childFolderIDs) {
			hidden = document.getElementById(childFolderID).classList.toggle('hidden');
		}

		if (hidden) {
			for (let nestedFolderID of nestedFolderIDs) {
				document.getElementById(nestedFolderID).className = "hidden";
			}
		}
	});
}

function selectFolderOnClick(folderID) {
	document.getElementById(`${folderID}-filter`).addEventListener("click", (e) => {
		if (selectedIndexFolderID == folderID) {
			selectedIndexFolderID = "root";
		}
		else {
			selectedIndexFolderID = folderID;
		}

		console.log("TODO: Filter Folder. ", folderID);
	});
}

function contextFolderOnRightClick(folderID) {
	document.getElementById(folderID).addEventListener("contextmenu", (e) => {
		e.preventDefault();

		let x = e.pageX;
		let y = e.pageY;

		removePopup();
		popupElementID = "folder-context";

		let HTML = html.FolderContextHTML();
		// document.getElementById(folderID).insertAdjacentHTML("beforeend", HTML);
		indexFolders.insertAdjacentHTML("beforeend", HTML);

		let contextFolder = document.getElementById("folder-context");

		contextFolderNewFolder(folderID);
		contextFolderNewNote(folderID);
		contextFolderDeleteFolder(folderID);

		contextFolder.style.left = `${x}px`;
		contextFolder.style.top = `${y}px`;
		contextFolder.style.zIndex = 2;
	});
}

function contextFolderNewFolder(folderID) {
	document.getElementById("new-folder").addEventListener("click", () => {
		let folder = new objects.Folder(folderID);
		json.insertIndexFolder(folder);
	});
}

function contextFolderNewNote(folderID) {
	document.getElementById("new-note").addEventListener("click", () => {
		let note = new objects.Note(folderID);
		json.insertIndexNote(note);
	});
}

function contextFolderDeleteFolder(folderID) {
	document.getElementById("delete-folder").addEventListener("click", () => {
		let folder = json.folders[folderID];
		json.deleteIndexFolder(folder);
	});
}

//////////////////////
// LOAD INDEX NOTES //
//////////////////////

function loadNoteHTML(note) {
	try {
		let HTML = html.NoteHTML(note)
		indexNotes.insertAdjacentHTML("beforeend", HTML) //MAKE ALPHABETICAL

		contextNoteOnRightClick(note.indexID);
	}
	catch (error) { console.log(error) }
}

function contextNoteOnRightClick(noteID) {
	document.getElementById(noteID).addEventListener("contextmenu", (e) => {
		e.preventDefault();

		let x = e.pageX;
		let y = e.pageY;

		removePopup();
		popupElementID = "note-context";

		let HTML = html.noteContextHTML();
		indexNotes.insertAdjacentHTML("beforeend", HTML);

		let noteContext = document.getElementById("note-context");

		document.getElementById("delete-note").addEventListener("click", () => {
			let note = json.notes[noteID];
			json.deleteIndexNote(note);
		});

		noteContext.style.left = `${x}px`;
		noteContext.style.top = `${y}px`;
		noteContext.style.zIndex = 2;
	});
}

/////////////////////
// LOAD INDEX TAGS //
/////////////////////


function loadTagHTML(tag) {
	try {
		let HTML = html.TagHTML(tag.indexID)
		indexTags.insertAdjacentHTML("beforeend", HTML) //MAKE ALPHABETICAL

		selectTagOnClick(tag.indexID, tag["notes"])
	}
	catch (error) { console.log(error) }
}







/////////////////////
// EVENT LISTENERS //
/////////////////////

// FOLDERS //




// TAGS //

function newTag(tagID) {
	//TODO Create Tag in JSON if not there
}

function selectTagOnClick(tagID, noteIDs) {
	document.getElementById(tagID).addEventListener("click", (e) => {
		if (tagID in selectedIndexTags) {
			// REMOVE
		}
		else {
			selectedIndexTags.push(tagID)
		}
		// TODO
		// Filter notes by tag/folder
		console.log("TAG: ", tagID);
	});
}

// NOTES //



function newNoteTag(noteID, tagID) {
	//TODO Create new note tag
	// CHECK tag map and add Tag to scrollbar if not there
	//Call newTag() to create ne Tag in JSON if first instance of Tag
}

function previewNoteOnClick(nodeID) {
	document.getElementById(nodeID).addEventListener("click", (e) => {
		// TODO
		console.log("NOTE: ", noteID);
	});
}




const orderFunctions = [
	(a, b) => a.id - b.id, //createdDateAscending: 
	(a, b) => b.id - a.id //createdDateDescending: 
]

const order = function () {
	const ordered = [...document.getElementsByTagName("index-note")].sort(sortOrder);
	ordered.forEach((element, index) => {
		element.style.order = index;
		console.log(index, ": ", element.getElementsByTagName("note-title")[0])
	});
}

let sortOrder = orderFunctions[0]
let sortOrderIndex = 0;

sortNotesBtn.addEventListener("click", (e) => {
	try {
		sortOrderIndex = (sortOrderIndex + 1) % 2
		sortOrder = orderFunctions[sortOrderIndex]
		console.log(sortOrder)
		order()
	}
	catch (error) {
		console.log("ERROR: ", error);
	}
});

function removePopup() {
	try {
		document.getElementById(popupElementID).remove();
		popupElementID = "";
	}
	catch (error) {

	}
}

document.addEventListener("click", () => {
	removePopup();
});

loadIndexData();

//Right-click edit Folder: name, move to, [all]
//Right-click edit Note: name, etc, [all]
//Need a "choose folder" menu for moving folders and files

//Note preview
//New Folder Popop
//New Note Popup

//Enter editor (note)

//Editor formatting panel
//Editor note properties
//Editor note style
//Editor text
//Editor color
//Editor characters
//Editor workspaces (new, open, change, edit)
//Open .html note embedd
//save to html
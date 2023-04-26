import * as objects from './objects.js';

const fs = require('fs');

///////////////
// CONSTANTS //
///////////////

export const JSON_DIR_ROOT = 'src/json/root.json';
export const JSON_DIR_FOLDERS = 'src/json/folders.json';
export const JSON_DIR_NOTES = 'src/json/notes.json';
export const JSON_DIR_TAGS = 'src/json/tags.json';

export const FOLDERS = "folders";
export const NOTES = "notes";
export const TAGS = "tags";

///////////////////////
// RUNTIME VARIABLES //
///////////////////////

export var root = readIndexJSON(JSON_DIR_ROOT);
export var folders = readIndexJSON(JSON_DIR_FOLDERS);
export var notes = readIndexJSON(JSON_DIR_NOTES);
export var tags = readIndexJSON(JSON_DIR_TAGS);

///////////////////
// JSON HANDLERS //
///////////////////

export function readIndexJSON(JSON_DIR) {
	try {
		const jsonString = fs.readFileSync(JSON_DIR);

		try {
			let parsedJSON = JSON.parse(jsonString);
			return parsedJSON;
		}
		catch (error) {
			console.log(error);
			return null;
		}
	}
	catch (error) {
		console.log(error);
		return null;
	}
}

export function deleteRootJSON(rootElement, indexID) {

	root[rootElement] = root[rootElement].filter(function (ID) {
		return ID != indexID;
	});

	// let indexIDs = [];

	// for (let ID in root[rootElement]) {
	// 	if (ID !== indexID) {
	// 		indexIDs.push(ID);
	// 	}
	// }

	// root[rootElement] = indexIDs;
	let jsonString = JSON.stringify(root, null, 4);
	writeIndexJSON(JSON_DIR_ROOT, jsonString);
}

export function deleteIndexJSON(JSON_DIR, jsonObject, indexObject) {
	let jsonStrings = []

	for (let indexID in jsonObject) {
		if (indexID !== indexObject.indexID) {
			jsonStrings.push(`"${indexID}": ${JSON.stringify(jsonObject[indexID])}`);
		}
	}

	let jsonString = `{\n${jsonStrings.join(",\n")}\n}`

	writeIndexJSON(JSON_DIR, jsonString);
}

export function insertRootJSON(rootElement, indexID) {
	root[rootElement].push(indexID);
	let jsonString = JSON.stringify(root, null, 4);
	writeIndexJSON(JSON_DIR_ROOT, jsonString);
}

export function insertIndexJSON(JSON_DIR, jsonObject, indexObject) {
	let jsonStrings = [];

	for (let indexID in jsonObject) {
		jsonStrings.push(`"${indexID}": ${JSON.stringify(jsonObject[indexID])}`);
	}

	jsonStrings.push(`"${indexObject.indexID}": ${JSON.stringify(indexObject)}`);
	let jsonString = `{\n${jsonStrings.join(",\n")}\n}`

	writeIndexJSON(JSON_DIR, jsonString);
}

export function updateIndexJSON(JSON_DIR, jsonObject, indexObject) {
	let jsonStrings = [];

	for (let indexID in jsonObject) {
		if (indexID !== indexObject.indexID) {
			jsonStrings.push(`"${indexID}": ${JSON.stringify(jsonObject[indexID])}`);
		}
		else {
			jsonStrings.push(`"${indexObject.indexID}": ${JSON.stringify(indexObject)}`);
		}
	}

	let jsonString = `{\n${jsonStrings.join(",\n")}\n}`

	writeIndexJSON(JSON_DIR, jsonString);
}

export function writeIndexJSON(JSON_DIR, jsonString) {
	try {
		fs.writeFileSync(JSON_DIR, jsonString);
	}
	catch (error) {
		console.log(error);
	}
}

//////////////////
// JSON FOLDERS //
//////////////////

export function deleteIndexFolder(indexFolder) {

	if (indexFolder.parentFolderID == "root") {
		deleteRootJSON(FOLDERS, indexFolder.indexID);
	}
	else {
		removeFolderFromFolder(indexFolder);
	}

	for (let childFolder of indexFolder.folders) {
		deleteIndexFolder(childFolder);
	}
	for (let childNote of indexFolder.notes) {
		deleteIndexNote(childNote);
	}

	deleteIndexJSON(JSON_DIR_FOLDERS, folders, indexFolder);
}

export function insertIndexFolder(indexFolder) {

	if (indexFolder.parentFolderID == "root") {
		insertRootJSON(FOLDERS, indexFolder.indexID);
	}
	else {
		addFolderToFolder(indexFolder);
	}

	insertIndexJSON(JSON_DIR_FOLDERS, folders, indexFolder);
}

export function updateIndexFolder(indexFolder) {

	// check to see if any folder has this folder as a child, update child/parent relationship
	// add folder to parent if not listed in parent

	updateIndexJSON(JSON_DIR_FOLDERS, folders, indexFolder);
}

// moveIndexFolder(indexFolder, newParentFolderID)

////////////////
// JSON NOTES //
////////////////

export function deleteIndexNote(indexNote) {

	if (indexNote.parentFolderID == "root") {
		deleteRootJSON(NOTES, indexNote.indexID);
	}
	else {
		removeNoteFromFolder(indexNote);
	}

	deleteIndexJSON(JSON_DIR_NOTES, notes, indexNote);
}

export function insertIndexNote(indexNote) {

	if (indexNote.parentFolderID == "root") {
		insertRootJSON(NOTES, indexNote.indexID);
	}
	else {
		addNoteToFolder(indexNote);
		for (let tagID in indexNote.tags) {
			// addNoteToTag
		}
	}

	insertIndexJSON(JSON_DIR_NOTES, notes, indexNote);
}

export function updateIndexNote(indexNote) {
	updateIndexJSON(JSON_DIR_NOTES, notes, indexNote);
}

// moveIndexNote(indexNote, newParentFolderID)

///////////////
// JSON TAGS //
///////////////

export function deleteIndexTag(indexTag) {
	deleteRootTag(indexTag);
	for (let noteID in indexTag.notes) {
		removeTagFromNote(noteID, indexTag.indexID);
	}
	deleteIndexJSON(JSON_DIR_TAGS, tags, indexTag);
}

export function insertIndexTag(indexTag) {
	insertRootTag(indexTag);
	for (let noteID in indexTag.notes) {
		addTagToNote(noteID, indexTag.indexID);
	}
	insertIndexJSON(JSON_DIR_TAGS, tags, indexTag);
}

export function updateIndexTag(indexTag) {
	updateIndexJSON(JSON_DIR_TAGS, tags, indexTag);
}

// PARENT HANDLERS //

// Folders 

function addFolderToFolder(indexFolder) {
	let folder = folders[indexFolder.parentFolderID];
	folder[FOLDERS].push(indexFolder.indexID);
	updateIndexJSON(JSON_DIR_FOLDERS, folders, folder);
}

function removeFolderFromFolder(indexFolder) {
	let folder = folders[indexFolder.parentFolderID];
	folder[FOLDERS] = folder[FOLDERS].filter(function (child) {
		return child != indexFolder.indexID;
	});
	updateIndexJSON(JSON_DIR_FOLDERS, folders, folder);
}

//  Notes

function addNoteToFolder(indexNote) {
	let folder = folders[indexNote.parentFolderID];
	folder[FOLDERS].push(indexNote.indexID);
	updateIndexJSON(JSON_DIR_FOLDERS, folders, folder);
}

function removeNoteFromFolder(indexNote) {
	let folder = folders[indexNote.parentFolderID];
	folder[NOTES] = folder[NOTES].filter(function (child) {
		return child != indexNote.indexID;
	});
	updateIndexJSON(JSON_DIR_FOLDERS, folders, folder);
}

// Tags objects

function addTagToNote(indexNote, tagID) {
	let note = notes[indexNote.indexID];
	note[TAGS].push(tagID);

	if (tags[tagID]) {
		let tag = tags[tagID];
		tag[NOTES].push(note.indexID);
		updateIndexJSON(JSON_DIR_TAGS, tags, tag);
	}
	else {
		let tag = objects.Tag(tagID);
		tag.notes.push(note.indexID);
		insertIndexJSON(JSON_DIR_TAGS, tags, tag);
	}

	updateIndexJSON(JSON_DIR_NOTES, notes, note);
}

function removeTagFromNote(noteID, tagID) {
	let note = notes[noteID];
	note[TAGS] = note[TAGS].filter(function (child) {
		return child != tagID;
	});

	let tag = tags[tagID];
	tag[NOTES] = tag[NOTES].filter(function (child) {
		return child != note.indexID;
	});

	if (tag[NOTES]) {
		updateIndexJSON(JSON_DIR_TAGS, tags, tag);
	}
	else {
		deleteIndexJSON(JSON_DIR_TAGS, tags, tag);
	}

	updateIndexJSON(JSON_DIR_NOTES, notes, note);
}


///////////////
// JSON ROOT //
///////////////

// ROOT NOTES

// ROOT TAGS

function deleteRootTag(rootTag) {
	deleteRootJSON(TAGS, rootTag.indexID);
}

function insertRootTag(rootTag) {
	insertRootJSON(TAGS, rootTag.indexID);
}
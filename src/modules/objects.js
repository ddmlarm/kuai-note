///////////////////
// INDEX OBJECTS //
///////////////////



///////////////////
// INDEX FOLDERS //
///////////////////

export function Folder(parentFolderID) {
	this.indexID = generateIndexID();
	this.folderName = "New Folder";
	this.folders = [];
	this.notes = [];
	this.parentFolderID = parentFolderID;
}

/////////////////
// INDEX NOTES //
/////////////////

export function Note(parentFolderID) {
	this.indexID = generateIndexID();
	this.title = "New Note";
	this.date = "DATE FORMAT";
	this.folderName = "GET Folder.folderName()";
	this.path = "C: PATH ";
	this.tags = [];
	this.parentFolderID = parentFolderID;
}

////////////////
// INDEX TAGS //
////////////////

export function Tag(indexID) {
	this.indexID = indexID;
	this.notes = [];
}

///////////////////////
// GENERATE INDEX ID //
///////////////////////

export function generateIndexID() {
	const date = new Date();

	let year = date.getFullYear().toString();
	let month = (date.getMonth() + 1).toString();
	let day = date.getDate().toString();
	let hours = date.getHours().toString();
	let minutes = date.getMinutes().toString();
	let seconds = date.getSeconds().toString();
	let milliseconds = date.getMilliseconds().toString();

	while (month.length < 2) {
		month = "0" + month;
	}

	while (day.length < 2) {
		day = "0" + day;
	}

	while (hours.length < 2) {
		hours = "0" + hours;
	}

	while (minutes.length < 2) {
		minutes = "0" + minutes;
	}

	while (seconds.length < 2) {
		seconds = "0" + seconds;
	}

	while (milliseconds.length < 4) {
		milliseconds = "0" + milliseconds;
	}

	let ID = year + month + day + hours + minutes + seconds + milliseconds;

	return ID;
}
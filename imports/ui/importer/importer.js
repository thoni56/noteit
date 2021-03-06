import { importNote, addTagIdToNote } from '../../api/notes';
import { Tags, createTag } from '../../api/tags';
import Papa from 'papaparse';

export function csvImporter(string) {
    if (string) {
        const results = Papa.parse(string.trim(), { header: true, skipEmptyLines: true });
        if (results.data.length > 0) {
            results.data.forEach(element => {
                const content = convertBackslashBackslashNToNewline(element.content);
                importNoteAndTags(element.title, content, element.tags, element.created, element.modified);
            });
        }
    }
}

function convertBackslashBackslashNToNewline(content) {
    return content ? content.replace(/\\\\n/g, "\n") : "";
}

function importNoteAndTags(title, content, tags, created, modified) {
    importNote(title, content, created, modified, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            if (tags) {
                const tagNames = tags.split(",");
                trimTagNames(tagNames); 
                tagNames.forEach(function (tagName) {
                    addTagnameToNote(tagName, result);
                })
            }
        }
    });
}


function addTagnameToNote(tagName, note) {
    const tag = Tags.findOne({ name: tagName });
    if (!tag) {
        createTag(tagName, (err, result) => {
            if (err) {
                alert(err);
            } else {
                addTagIdToNote(result, note);
            }
        });
    }
    else {
        addTagIdToNote(tag._id, note);
    }
}

function trimTagNames(tagNames) {
    tagNames.forEach(function (tagName, index, tagNames) {
        tagNames[index] = tagName.trim();
    });
}


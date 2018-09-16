import { createNote, addTagIdToNote } from '../../api/notes';
import { Tags, createTag } from '../../api/tags';
import Papa from 'papaparse';

export function csvImporter(string) {
    if (string) {
        const results = Papa.parse(string.trim(), { header: true, skipEmptyLines: true });
        if (results.data.length > 0) {
            results.data.forEach(element => {
                const content = convertBackslashBackslashNToNewline(element.content);
                importNoteAndTags(element.title, content, element.tags);
            });
        }
    }
}

function convertBackslashBackslashNToNewline(content) {
    return content ? content.replace(/\\\\n/g, "\n") : "";
}

function importNoteAndTags(title, content, tags) {
    createNote(title, content, (error, result) => {
        if (error) {
            alert(error);
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
                console.log("Create tag="+result);
                addTagIdToNote(result, note);
            }
        });
    }
    else {
        return tag._id;
    }
}

function trimTagNames(tagNames) {
    tagNames.forEach(function (tagName, index, tagNames) {
        tagNames[index] = tagName.trim();
    });
}


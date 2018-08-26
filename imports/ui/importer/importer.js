import { createNote, addTagIdToNote } from '../../api/notes';
import { Tags } from '../../api/tags';
import { Papa } from 'meteor/harrison:papa-parse';

export function csvImporter(string) {
    if (string) {
        const results = Papa.parse(string.trim(), { header: true, skipEmptyLines: true });
        if (results.data.length > 0) {
            results.data.forEach(element => {
                const content = convertBackslashBackslashNToNewline(element.content);
                importNote(element, content);
            });
        }
    }
}

function convertBackslashBackslashNToNewline(content) {
    return content ? content.replace(/\\\\n/, "\n") : "";
}

function importNote(element, content) {
    const note = createNote(element.title, content);
    if (element.tags) {
        const tagNames = element.tags.split(",");
        trimTagNames(tagNames); 
        tagNames.forEach(function (tagName) {
            let tagId = findOrCreateTag(tagName);
            addTagIdToNote(tagId, note);
        })
    }
}

function findOrCreateTag(tagName) {
    const tag = Tags.findOne({ name: tagName });
    let tagId;
    if (!tag) {
        tagId = Tags.insert({ name: tagName });
    }
    else {
        tagId = tag._id;
    }
    return tagId;
}

function trimTagNames(tagNames) {
    tagNames.forEach(function (tagName, index, tagNames) {
        tagNames[index] = tagName.trim();
    });
}


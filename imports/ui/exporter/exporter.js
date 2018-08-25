import { allNotes } from '../../api/notes';
import { Tags } from '../../api/tags';

export function serializeAllNotes() {
    const notes = allNotes().fetch();

    const serializedNotes = notes.map(function(note) {
        const content = note.content?note.content.replace(/\n/g, '\\\\n'):"";
        return { title: note.title, content: content, tags: serializeTags(note.tags) };
    })
    return serializedNotes;
}

export function convertSerializedNotesToCSV(notes) {  
    var result, first, keys, columnDelimiter, lineDelimiter;

    columnDelimiter = ',';
    lineDelimiter = '\n';

    keys = ['title', 'content', 'tags'];

    result = '';

    // Header
    result += keys.join() + lineDelimiter;

    // Data
    notes.forEach(function(note) {
        first = true;
        keys.forEach(function(key) {
            if (!first) result += columnDelimiter;
            first = false;

            result += '"'+note[key]+'"';
        });
        result += lineDelimiter;
    });

    return result;
}

function serializeTags(tagIds) {
    if (!tagIds) return "";

    const tagNames = tagIds.map(function (tagId) {
        tag = Tags.findOne({ _id: tagId });
        return tag?tag.name:"";
    }).filter(element => element);
    return tagNames.join();
}
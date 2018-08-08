import { allNotes } from '../../api/notes';
import { Tags } from '../../api/tags';

export function serializeNotes() {
    const notes = allNotes().fetch();

    const serializedNotes = notes.map(function(note) {
        return { title: note.title, content: note.content, tags: serializeTags(note.tags) };
    })
    return serializedNotes;
}

export function convertSerializedNotesToCSV(notes) {  
    var result, first, keys, columnDelimiter, lineDelimiter;

    if (notes == null || !notes.length) {
        return "";
    }

    columnDelimiter = ',';
    lineDelimiter = '\n';

    keys = ['title', 'content', 'tags'];

    result = '';

    // Header
    //  result += keys.join(columnDelimiter);
    //  result += lineDelimiter;

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
        tag = Tags.findOne({ id: tagId });
        return tag.name;
    })
    return tagNames.join();
}
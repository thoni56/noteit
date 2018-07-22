import { Mongo } from 'meteor/mongo';

export const Notes = new Mongo.Collection('Notes');

export function notesWithTags(tags) {
    // TODO: Should not need to know about the undefined element in tags...
    if (tags.length == 1) {
        return Notes.find({}, { sort: { createdAt: -1}});
    } else {
        const activeTags = tags.slice(0, tags.length-1);
        return Notes.find({ tags: { $all: activeTags }}, { sort: { createdAt: -1}});
    }
}

export function tagsForNote(noteId) {
    // Abstraction for relation between tags and notes
    const note = Notes.findOne({_id: noteId});
    if (note && note.tags) {
        return note.tags;
    } else {
        return [];
    }

}
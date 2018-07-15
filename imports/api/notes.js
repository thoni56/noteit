import { Mongo } from 'meteor/mongo';

export const Notes = new Mongo.Collection('Notes');

export function notesWithTags(tags) {
    if (tags.length == 0) {
        return Notes.find({}, { sort: { createdAt: -1}});
    } else {
        return Notes.find({ tags: { $all: tags }}, { sort: { createdAt: -1}});
    }
}

export function tagsForNote(noteId) {
    // Abstraction for relation between tags and notes
    var note = Notes.findOne({_id: noteId});
    if (note) {
        return note.tags;
    } else {
        return [];
    }

}
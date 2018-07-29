import { Mongo } from 'meteor/mongo';

export const Notes = new Mongo.Collection('Notes');

export function notesWithTags(tags, sorting) {
    if (!sorting) {
        sorting = { createdAt: -1 };
    }

    if (tags.length == 0) {
        return Notes.find({}, { sort: sorting });
    } else {
        return Notes.find({ tags: { $all: tags } }, { sort: sorting });
    }
}

export function allNotes() {
    return Notes.find({});
}

export function tagsForNote(noteId) {
    // Abstraction for relation between tags and notes
    const note = Notes.findOne({ _id: noteId });
    if (note && note.tags) {
        return note.tags;
    } else {
        return [];
    }
}

export function addTagToNote(tag, note) {
    const tagsArray = tagsForNote(note);
    if (!tagsArray.includes(tag._id)) {
        tagsArray.push(tag._id);
        Notes.update(note, {
            $set: { tags: tagsArray }
        });
    }
}

export function createNote(title, content) {
    const noteId = Notes.insert({
        owner: Meteor.userId(),
        title: title,
        content: content,
        createdAt: new Date(),
    });
    return noteId;
}

export function deleteNote(noteId) {
    Notes.remove(noteId);
}
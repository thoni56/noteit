import { Mongo } from 'meteor/mongo';

export const Notes = new Mongo.Collection('Notes');

export function notesWithTags(tags, sorting) {
    if (!sorting) {
        sorting = { createdAt: -1 };
    }

    if (tags.length == 0) {
        return Notes.find({}, { sort: sorting });
    } else {
        return Notes.find({ tags: { $all: tags } }, { sort: { sorting } });
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
    const tagsArray = tags.get();
    if (!tagsArray.includes(tag._id)) {
        tagsArray.push(tag._id);
        tags.set(tagsArray);
        tagsField.value = '';
        Notes.update(note, {
            $set: { tags: tagsArray }
        });
    }
}
import { Mongo } from 'meteor/mongo';

export const Notes = new Mongo.Collection('Notes');

Meteor.methods({
    'note.create'(title, content) {
        const noteId = Notes.insert({
            owner: Meteor.userId(),
            title: title,
            content: content,
            createdAt: new Date(),
        });
        return noteId;    
    },
    'note.import'(title, content, created, modified) {
        const noteId = Notes.insert({
            owner: Meteor.userId(),
            title: title,
            content: content,
            createdAt: created,
            modifiedAt: modified
        });
        return noteId;    
    },
    'note.delete'(noteId) {
        Notes.remove(noteId);
    },
    'note.update'(noteId, fields) {
        Notes.update(noteId, fields);
    }
})

export function allNotes() {
    return Notes.find({});
}

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

export function tagsForNote(noteId) {
    // Abstraction for relation between tags and notes
    const note = Notes.findOne({ _id: noteId });
    if (note && note.tags) {
        return note.tags;
    } else {
        return [];
    }
}

export function addTagToNote(tag, noteId) {
    addTagIdToNote(tag._id, noteId);
}

export function addTagIdToNote(tagId, noteId) {
    const tagsArray = tagsForNote(noteId);
    if (!tagsArray.includes(tagId)) {
        tagsArray.push(tagId);
        Meteor.call('note.update', noteId, {
            $set: { tags: tagsArray }
        });
    }
}

export function createNote(title, content, callback) {
    Meteor.call('note.create', title, content, callback)
}

export function importNote(title, content, created, modified, callback) {
    Meteor.call('note.import', title, content, created, modified, callback)
}

export function deleteNote(noteId) {
    Meteor.call('note.delete', noteId);
}

export function updateNote(noteId, title, content) {
    Meteor.call('note.update', noteId, {
        $set: {
        title: title,
            content: content,
            modifiedAt: new Date(),
        },
    });
}

export function getNote(noteId) {
    return Notes.findOne({_id: noteId});
}
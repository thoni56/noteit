import { Template } from 'meteor/templating';
import SimpleMDE from 'simplemde';
import { Notes } from '../api/notes';
import { Tags } from '../api/tags';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveArray } from 'meteor/templates:array';
 
import './editor.html';

import './notetag.js';

export var editor;
export var currentNote = new ReactiveVar(null);

var tagsField;
var titleField;

var tags = ReactiveVar([]);

export function load(note_id, noteTags) {
    save();
    currentNote = note_id;
    var note = Notes.findOne({_id: note_id});
    titleField.value = note.title;
    if (note.content === null) {
        editor.value("");
    } else {
        editor.value(note.content);
    }
    if (noteTags) {
        tags.set(noteTags);
        console.log(noteTags);
        console.log(Tags.find({ _id: { $in : noteTags }}).fetch());
    } else {
        tags.set([]);
    }
}

export function save() {
    const title = document.getElementById('note-title').value.trim();
 
    if (!editorIsEmpty(title)) {
        if (!editingExistingNote()) {
            // Insert the note in the collection
            currentNote = Notes.insert({
                title: title,
                content: editor.value(),
                createdAt: new Date(),
            });
        } else {
            Notes.update(currentNote, {
                $set: { title: title,
                        content: editor.value(),
                        modifiedAt: new Date(),
                },
            });
        }
    }
}

Template.editor.onRendered(function () {
    editor = new SimpleMDE({element: document.getElementById("editor")});
    tagsField = document.getElementById('add-tag');
    titleField = document.getElementById('note-title')
});

Template.editor.helpers({
    notetags() {
        return Tags.find({ _id: { $in : tags.get() }});
    }, 
});

Template.editor.events({
    'submit .edit-title-form'(event) {
        // Prevent default browser submit
        event.preventDefault();

        save();
        const title = titleField.value.trim();
        if (!editorIsEmpty(title)) {
            editor.codemirror.focus();
        }
    },

    'submit .edit-tags-form'(event) {
        event.preventDefault();
        let tagname = tagsField.value.trim();
        let tag = Tags.findOne({name: tagname});
        if (tag) {
            const tagsArray = tags.get();
            tagsArray.push(tag._id);
            tags.set(tagsArray);
            tagsField.value = '';
            event.target.reset();
            Notes.update(currentNote, {
                $set: { tags: tagsArray }
            });
        }
    },

    'click .add-note'(event) {
        if (event.detail === 0) {
            // This was not an actual click, but a click generate by enter in the input field
            return;
        }

        event.preventDefault();
        resetEditor();
    },

    'click .delete-note'(event) {
        Notes.remove(currentNote);
        resetEditor();
    }
});

function editingExistingNote() {
    return currentNote && Notes.find({_id:currentNote}).count();
}

function editorIsEmpty(title) {
    return title.length == 0 && editor.value().length == 0; 
}

function resetEditor() {
    titleField.value = '';
    document.getElementById('edit-title-form').reset(); // Reset the form
    currentNote = null;
    editor.value('');
    tags.set([]);
}

import { Template } from 'meteor/templating';
import SimpleMDE from 'simplemde';
import { Notes } from '../api/notes';
import { ReactiveVar } from 'meteor/reactive-var';

import './editor.html';

export var editor;
export var currentNote = new ReactiveVar(null);

export function load(note_id) {
    save();
    currentNote = note_id;
    var note = Notes.findOne({_id: note_id});
    titleField().value = note.title;
    if (note.content === null) {
        editor.value("");
    } else {
        editor.value(note.content);
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
});

Template.editor.events({
    'submit .edit-title'(event) {
        // Prevent default browser submit
        event.preventDefault();

        save();
        const title = titleField().value.trim();
        if (!editorIsEmpty(title)) {
            editor.codemirror.focus();
        }
    },

    'click .add-note'(event) {
        if (event.detail === 0) {
            // This was not an actual click, but a click generate by enter in the input field
            return;
        }

        event.preventDefault();

        resetEditor(event.target);
    },

    'click .delete-note'(event) {
        Notes.remove(currentNote);
        resetEditor();
    }
});

function titleField() {
    return document.getElementById('note-title');
}

function editingExistingNote() {
    return currentNote && Notes.find({_id:currentNote}).count();
}

function editorIsEmpty(title) {
    return title.length == 0 && editor.value().length == 0; 
}

function resetEditor() {
    titleField().value = '';
    document.getElementById('edit-title-form').reset(); // Reset the form
    currentNote = null;
    editor.value('');
}



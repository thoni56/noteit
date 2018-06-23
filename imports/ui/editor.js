import { Template } from 'meteor/templating';
import SimpleMDE from 'simplemde';
import { Notes } from '../api/notes';

import './editor.html';

export let editor;

export function load(note_id) {
    save();
    editor.currentNote = note_id;
    var note = Notes.findOne({_id: note_id});
    document.getElementsByName('title')[0].value = note.title;
    if (note.content === null) {
        editor.value("");
    } else {
        editor.value(note.content);
    }
}

export function save() {
    const title = document.getElementsByName('title')[0].value.trim();
 
    if (!editorEmpty(title)) {
        if (!editingExistingNote()) {
            // Insert the note in the collection
            editor.currentNote = Notes.insert({
                title: title,
                content: editor.value(),
                createdAt: new Date(),
            });
        } else {
            Notes.update(editor.currentNote, {
                $set: { title: title,
                        content: editor.value(),
                        modifiedAt: new Date(),
                },
            });
        }
    }
}

function editingExistingNote() {
    return editor.currentNote && Notes.find({_id:editor.currentNote}).count();
}

function editorEmpty(title) {
    return title.length == 0 && editor.value().length == 0; 
}

Template.editor.onRendered(function () {
  editor = new SimpleMDE({element: document.getElementById("editor")});
});

Template.editor.events({
    'submit .edit-title'(event) {
        // Prevent default browser submit
        event.preventDefault();

        save();
        const title = document.getElementsByName('title')[0].value.trim();
        if (!editorEmpty(title)) {
            editor.codemirror.focus();
        }
    },

    'click .add-note'(event) {
        if (event.detail === 0) {
            // This was not an actual click, but a click generate by enter in the input field
            return;
        }

        event.preventDefault();

        event.target.title.value = '';
        $('form.edit-title')[0].reset(); // Reset the form
        editor.currentNote = null;
        editor.value('');
    }

});

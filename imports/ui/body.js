import { Template } from 'meteor/templating';
import { Notes } from '../api/notes.js';
import { editor } from '../../client/main.js';

import './note.js';
import './body.html';


Template.body.helpers({
    notes() {
        return Notes.find({}, { sort: { createdAt: -1}});
    }
});

Template.body.events({
    'submit .edit-title'(event) {
        function editingExistingNote() {
            return editor.currentNote && Notes.find({_id:editor.currentNote}).count();
        }

        function editorEmpty(title) {
            return title.length == 0 && editor.value().length == 0; 
        }

        // Prevent default browser submit
        event.preventDefault();
        
        // Get value from form element
        const target = event.target;
        const title = target.title.value;
        
        if (!editorEmpty(title)) {
            if (!editingExistingNote()) {
                // Insert the note in the collection
                editor.currentNote = Notes.insert({
                    title: title,
                    createdAt: new Date(),
                });
            } else {
                Notes.update(editor.currentNote, {
                    $set: { title: title,
                            content: editor.value()
                    },
                });
            }
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

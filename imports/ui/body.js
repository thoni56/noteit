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
    'submit .new-note'(event) {
        function editingExistingNote() {
            return editor.currentNote && Notes.find({_id:editor.currentNote}).count();
        }
        
        // Prevent default browser submit
        event.preventDefault();
        
        // Get value from form element
        const target = event.target;
        const title = target.title.value;
        
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

    //editor.value('# '+title);
        editor.codemirror.focus();
        
        // Clear form
        //target.title.value = '';
    },
});

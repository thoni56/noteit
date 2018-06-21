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
        // Prevent default browser submit
        event.preventDefault();
        
        // Get value from form element
        const target = event.target;
        const text = target.text.value;
        
        // Insert the note in the collection
        Notes.insert({
            title: text,
            createdAt: new Date(),
        });
        
        editor.value(text);
        
        // Clear form
        target.text.value = '';
    },
});


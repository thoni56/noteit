import { Template } from 'meteor/templating';
import { Notes } from '../api/notes.js';
import { editor } from './editor.js';

import './note.js';
import './body.html';


Template.body.helpers({
    notes() {
        return Notes.find({}, { sort: { createdAt: -1}});
    }
});

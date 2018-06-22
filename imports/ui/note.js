import { Template } from 'meteor/templating';
import { Notes } from '../api/notes.js';

import './note.html';

Template.note.events({
    'click .delete'() {
        Notes.remove(this._id);
    },
});
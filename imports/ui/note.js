import { Template } from 'meteor/templating';
import { Notes } from '../api/notes.js';
import { editor, load } from '../ui/editor';

import './note.html';

Template.note.events({
    'click .delete'() {
        Notes.remove(this._id);
    },

    'click .notetitle'() {
        load(this._id);
    }
});
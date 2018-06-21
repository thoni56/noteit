import { Template } from 'meteor/templating';
import { Notes } from '../api/notes.js';

import './body.html';

Template.body.helpers({
    notes() {
        return Notes.find({});
    }
});

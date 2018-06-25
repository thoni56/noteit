import { Template } from 'meteor/templating';
import { Notes } from '../api/notes.js';
import { Tags } from '../api/tags.js';

import './note.js';
import './tag.js';

import './body.html';

Template.body.helpers({
    notes() {
        return Notes.find({}, { sort: { createdAt: -1}});
    },
    tags() {
        return Tags.find({}, { sort: { name : 1}});
    },
});
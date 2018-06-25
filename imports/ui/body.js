import { Template } from 'meteor/templating';
import { Notes } from '../api/notes.js';
import { Tags } from '../api/tags.js';
import { editor } from './editor.js';

import './note.js';
import './tag.js';

import './body.html';

Template.body.helpers({
    notes() {
        return Notes.find({}, { sort: { createdAt: -1}});
    },
    tags() {
        return [
            { _id: 1, name: 'Tag1' },
            { _id: 2, name: 'Tag2' },
            { _id: 3, name: 'Tag3' },
          ]; //Tags.find({}, { sort: { name: 1}});
    },
});
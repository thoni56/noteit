import { Template } from 'meteor/templating';
import { Notes, notesWithTags } from '../api/notes.js';
import { Tags } from '../api/tags.js';
import { setActiveTags, getActiveTags } from './tag';

import './note.js';
import './tag.js';

import './body.html';

Template.body.helpers({
    notes() {
        return notesWithTags(getActiveTags());
    },
    tags() {
        return Tags.find({}, { sort: { name : 1}});
    },
    noteCount() {
        return Notes.find({}).count();
    }
});

Template.body.events({
    'click .reset-tag-filter'() {
        setActiveTags([]);
        disableReset();
    },
});

function disableReset() {
    document.getElementById("reset-tag-0").classList.add("disabled");
}

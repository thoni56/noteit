import { Template } from 'meteor/templating';
import { Notes } from '../api/notes.js';
import { Tags } from '../api/tags.js';
import { setActiveTags, getActiveTags } from './tag';

import './note.js';
import './tag.js';

import './body.html';

Template.body.helpers({
    notes() {
        var activeTags = getActiveTags();
        if (activeTags.length == 0) {
            return Notes.find({}, { sort: { createdAt: -1}});
        } else {
            return Notes.find({ tags: { $all: activeTags }}, { sort: { createdAt: -1}});
        }
    },
    tags() {
        return Tags.find({}, { sort: { name : 1}});
    },
});

Template.body.events({
    'click .reset-tag-filter'() {
        setActiveTags([]);
    },
});
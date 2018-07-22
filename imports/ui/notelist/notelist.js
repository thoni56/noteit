import { Template } from 'meteor/templating';
import { Notes, notesWithTags } from '../../api/notes.js';
import { getActiveTags } from '../tagselector/tagselector.js';

import './notelist.html';
 
Template.notelist.helpers({
    notes() {
        return notesWithTags(getActiveTags());
    },
    counter() {
        let message = "";
        if (getActiveTags().length > 0) {
            message = filteredCount()+" out of ";
        }
        return message += totalCount();
    }
});

function filteredCount() {
    return notesWithTags(getActiveTags()).count();
};

function totalCount() {
    return Notes.find({}).count();
};

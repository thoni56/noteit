import { Template } from 'meteor/templating';
import { allNotes, notesWithTags } from '../../api/notes.js';
import { getActiveTags } from '../tagselector/tagselector.js';

import './notelist.html';

var sorting = ReactiveVar({ createdAt: -1 });
 
Template.notelist.helpers({
    notes() {
        return notesWithTags(getActiveTags(), sorting.get());
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
    return allNotes().count();
};

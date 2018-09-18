import { Template } from 'meteor/templating';
import { allNotes, notesWithTags } from '../../api/notes.js';
import { getActiveTags } from '../tagselector/tagselector.js';

import './notelist.html';

var sortId = ReactiveVar('createdup');
 
Template.notelist.helpers({
    notes() {
        return notesWithTags(getActiveTags(), sortingIdToFieldMap[sortId.get()]);
    },
    counter() {
        let message = "";
        if (getActiveTags().length > 0) {
            message = filteredCount()+" out of ";
        }
        return message += totalCount();
    }
});

const sortingIdToFieldMap = {
    'titleup' : { title: -1 },
    'titledown' : { title: 1},
    'createdup' : { createdAt: -1 },
    'createddown' :  { createdAt: 1 },
    'modifiedup' : { modifiedAt: -1 },
    'modifieddown' :  { modifiedAt: 1 }
};

Template.notelist.events({
    'change #sortselector': function (event) {
        const currentTarget = event.currentTarget;
        const selectedSorting = currentTarget.options[currentTarget.selectedIndex].value;
        sortId.set(selectedSorting);
      }
})

function filteredCount() {
    return notesWithTags(getActiveTags()).count();
};

function totalCount() {
    return allNotes().count();
};

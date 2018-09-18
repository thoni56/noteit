import { Template } from 'meteor/templating';
import { allNotes, notesWithTags } from '../../api/notes.js';
import { getActiveTags } from '../tagselector/tagselector.js';

import './notelist.html';

export function currentSortingField() {
    return sortingIdToField[sortId.get()];
}

var sortId = ReactiveVar('createdup');
 
Template.notelist.helpers({
    notes() {
        return notesWithTags(getActiveTags(), sortingIdToQuery[sortId.get()]);
    },
    counter() {
        let message = "";
        if (getActiveTags().length > 0) {
            message = filteredCount()+" out of ";
        }
        return message += totalCount();
    }
});

const sortingIdToField = {
    'titleup' : {field: undefined, type: undefined},
    'titledown' : {field: undefined, type: undefined},
    'createdup' : {field: 'createdAt', type: Date},
    'createddown' : {field: 'createdAt', type: Date},
    'modifiedup' : {field: 'modifiedAt', type: Date},
    'modifieddown' : {field: 'modifiedAt', type: Date}
};

const sortingIdToQuery = {
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

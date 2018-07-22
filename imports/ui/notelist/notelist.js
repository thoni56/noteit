import { Template } from 'meteor/templating';
import { Notes, notesWithTags } from '../../api/notes.js';
import { getActiveTags } from '../tagselector/tagselector.js';

import './notelist.html';
 
Template.notelist.helpers({
    notes() {
        return notesWithTags(getActiveTags());
    },
    filteredCount() {
        return notesWithTags(getActiveTags()).count();
    },
    totalCount() {
        return Notes.find({}).count();
    }
});

import { Template } from 'meteor/templating';
import { Notes, notesWithTags } from '../api/notes.js';
import { getActiveTags } from './tag.js';

import './notelist.html';

Template.notelist.helpers({
    notes() {
        return notesWithTags(getActiveTags());
    },
    noteCount() {
        return Notes.find({}).count();
    }
});

import { Template } from 'meteor/templating';
import { load } from '../editor/editor.js';

import './note.html';

const activeNote = new ReactiveVar(undefined);

export function setActive(id) {
    activeNote.set(id);
}

Template.note.helpers({
    tagCount() {
        if (this.tags) {
            return this.tags.length;
        } else {
            return 0;
        }
    },
    active() {
        if (this._id == activeNote.get()) {
            return "active";
        } else {
            return "";
        }
    },
    sortValue() {
        return "2018-01-01 12:34";
    }
})
Template.note.events({
    'click .list-group-item'() {
        load(this._id);
        activeNote.set(this._id);
    }
});
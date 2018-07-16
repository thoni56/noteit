import { Template } from 'meteor/templating';
import { load } from '../editor/editor.js';

import './note.html';

var activeNote = new ReactiveVar(undefined);

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
    }
})
Template.note.events({
    'click .list-group-item'() {
        load(this._id, this.tags);
        activeNote.set(this._id);
    }
});
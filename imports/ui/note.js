import { Template } from 'meteor/templating';
import { load } from '../ui/editor';

import './note.html';

var active = new ReactiveVar(undefined);

export function setActive(id) {
    active.set(id);
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
        if (this._id == active.get()) {
            return "active";
        } else {
            return "";
        }
    }
})
Template.note.events({
    'click .list-group-item'() {
        load(this._id, this.tags);
        active.set(this._id);
    }
});
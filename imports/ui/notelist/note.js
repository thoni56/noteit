import { Template } from 'meteor/templating';
import { load } from '../editor/editor.js';
import { currentSortingField } from './notelist';

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
        const { field, type } = currentSortingField();
        if (field) {
            if (type == Date) {
                return formattedDate(this[field]);
            } else {
                return this[field];
            }
        } else
            return "";
    }
})
Template.note.events({
    'click .list-group-item'() {
        load(this._id);
        activeNote.set(this._id);
    }
});

function formattedDate(field) {
    if (field) {
        const d = new Date(Date.parse(field));
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    } else {
        return "-";
    }
}
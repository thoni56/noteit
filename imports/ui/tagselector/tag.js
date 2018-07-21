import { Template } from 'meteor/templating';
import { createNewColumn } from './tagcolumn';

import './tag.html';


export function setActiveTags(tagList) {
    activeTags.set(tagList);
}

export function getActiveTags() {
    return activeTags.get();
}

const activeTags = new ReactiveVar([]);

Template.tag.helpers({
    active() {
        if (isInActiveTags(this._id)) {
            return "active";
        } else {
            return "";
        }
    },
});

Template.tag.events({
    'click .tag'(event) {
        const column = event.target.parentNode.id.slice('tag-column-'.length);
        console.log('select tag in column '+column);
        pushTag(this._id);
        enableReset(column);
        createNewColumn();
    },
    'click .edit-tag'() {
        console.log("edit tag ", this._id);
    }
});

function enableReset(column) {
    document.getElementById("reset-tag-"+column).classList.remove("disabled");
}

function isInActiveTags(id) {
    return activeTags.get().indexOf(id) != -1;
}

function pushTag(id) {
    const tags = getActiveTags();
    tags.push(id);
    setActiveTags(tags);
}
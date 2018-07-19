import { Template } from 'meteor/templating';
import { createNewColumn } from './tagcolumn';

import './tag.html';


export function setActiveTags(tagList) {
    activeTags.set(tagList);
}

export function getActiveTags() {
    return activeTags.get();
}

var activeTags = new ReactiveVar([]);

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
    'click .tag'() {
        setActiveTags([this._id]);
        enableReset();
        createNewColumn();
    },
    'click .edit-tag'() {
        console.log("edit tag ", this._id);
    }
});

function enableReset() {
    document.getElementById("reset-tag-0").classList.remove("disabled");
}

function isInActiveTags(id) {
    return activeTags.get().indexOf(id) != -1;
}

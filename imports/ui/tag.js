import { Template } from 'meteor/templating';
import { Tags } from '../api/tags.js';

import './tag.html';

export function setActiveTags(tagList) {
    activeTags.set(tagList);
    console.log('set active tags ' + tagList);
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
    },
    'click .edit-tag'() {
        console.log("edit tag ", this._id);
    }
});

function isInActiveTags(id) {
    return activeTags.get().indexOf(id) != -1;
}

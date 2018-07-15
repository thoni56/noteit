import { Template } from 'meteor/templating';
import { Tags } from '../api/tags.js';

import './tag.html';

var activeTags = new ReactiveVar([]);

export function setActiveTags(tagList) {
    activeTags.set(tagList);
}

Template.tag.helpers({
    active() {
        if (this._id == activeTags.get()) {
            return "active";
        } else {
            return "";
        }
    },
});

Template.tag.events({
   'click .tag'() {
        activeTags.set([this._id]);
    },
    'click .edit-tag'() {
        console.log("edit tag ", this._id);
    }
});
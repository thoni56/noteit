import { Template } from 'meteor/templating';
import { Tags } from '../api/tags.js';

import './tag.html';

var activeTag = new ReactiveVar(undefined);

Template.tag.helpers({
    active() {
        if (this._id == activeTag.get()) {
            return "active";
        } else {
            return "";
        }
    },
});

Template.tag.events({
    'click .reset-tag-filter'() {
        activeTag.set(undefined);
    },
    'click .tag'() {
        activeTag.set(this._id);
    },
    'click .edit-tag'() {
        console.log("edit tag ", this._id);
    }
});
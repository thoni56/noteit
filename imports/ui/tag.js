import { Template } from 'meteor/templating';
import { Tags } from '../api/tags.js';

import './tag.html';

Template.tag.events({
    'click .tag-list-item'() {
        console.log("klick tag ", this._id);
    },
    'click .remove-tag'() {
        console.log("remove tag ", this._id);
    }
});
import { Template } from 'meteor/templating';
import { load } from '../ui/editor';

import './note.html';

Template.note.helpers({
    tagCount() {
        if (this.tags) {
            return this.tags.length;
        } else {
            return 0;
        }
    }
})
Template.note.events({
    'click .list-group-item'() {
        load(this._id);
    }
});
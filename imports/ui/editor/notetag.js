import { Template } from 'meteor/templating';
import { removeTagFromCurrentNote } from './editor';

import './notetag.html';

Template.notetag.events({
    'click .remove-tag'(event) {
        removeTagFromCurrentNote(this._id);
    }
});
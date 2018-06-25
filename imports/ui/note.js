import { Template } from 'meteor/templating';
import { load } from '../ui/editor';

import './note.html';

Template.note.events({
    'click .list-group-item'() {
        load(this._id);
    }
});
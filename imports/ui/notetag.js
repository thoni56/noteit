import { Template } from 'meteor/templating';

import './notetag.html';

Template.notetag.events({
    'click .list-group-item'() {
        console.log("klick notetag ", this._id);
    }
});
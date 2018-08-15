import { Template } from 'meteor/templating';

import './notetag.html';

Template.notetag.events({
    'click .badge'() {
        console.log("klick notetag ", this._id);
    }
});
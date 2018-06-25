import { Template } from 'meteor/templating';
import { Tags } from '../api/tags.js';

import './tag.html';

Template.tag.events({
    'click .list-group-item'() {
        console.log("klick tag");
    }
});
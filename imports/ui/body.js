import { Template } from 'meteor/templating';
import { Tags } from '../api/tags.js';
import { setActiveTags } from './tagselector/tag.js';

import './body.html';

Template.body.helpers({
    tags() {
        return Tags.find({}, { sort: { name : 1}});
    }
});

Template.body.events({
    'click .reset-tag-filter'() {
        setActiveTags([]);
        disableReset();
    },
});

function disableReset() {
    document.getElementById("reset-tag-0").classList.add("disabled");
}

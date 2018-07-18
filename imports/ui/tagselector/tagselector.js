import { Template } from 'meteor/templating';
import { Tags } from '../../api/tags.js';
import { setActiveTags } from './tag.js';


import './tagselector.html';

Template.tagselector.helpers({
    tags() {
        return Tags.find({}, { sort: { name : 1}});
    }
});

Template.tagselector.events({
    'click .reset-tag-filter'() {
        setActiveTags([]);
        disableReset();
    },
});

function disableReset() {
    document.getElementById("reset-tag-0").classList.add("disabled");
}

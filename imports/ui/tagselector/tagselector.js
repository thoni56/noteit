import { Template } from 'meteor/templating';
import { Tags } from '../../api/tags.js';
import { setActiveTags } from './tag.js';

import './tagselector.html';

var lastColumn;

export function createNewColumn() {
    lastColumn = document.createElement("p");
    lastColumn.appendChild(document.createTextNode("new column"));
    document.getElementById("tagselector").appendChild(lastColumn);
}

Template.tagselector.helpers({
    tags() {
        return Tags.find({}, { sort: { name : 1}});
    }
});

Template.tagselector.events({
    'click .reset-tag-filter'() {
        setActiveTags([]);
        disableReset();
        document.getElementById("tagselector").removeChild(lastColumn);
    },
});

function disableReset() {
    document.getElementById("reset-tag-0").classList.add("disabled");
}

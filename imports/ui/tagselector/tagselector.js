import { Template } from 'meteor/templating';
import { Tags } from '../../api/tags.js';
import { setActiveTags } from './tag.js';
import { createNewColumn } from './tagcolumn';

import './tagselector.html';

export var columns = [];

Template.tagselector.events({
    'click .reset-tag-filter'() {
        setActiveTags([]);
        disableReset();
        var lastColumn = columns.pop();
        lastColumn.parentNode.removeChild(lastColumn);
    },
});

Template.tagselector.onRendered(function() {
    columns.push(createNewColumn());
});

function disableReset() {
    document.getElementById("reset-tag-0").classList.add("disabled");
}

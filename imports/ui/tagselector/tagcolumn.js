import { Template } from 'meteor/templating';
import { Tags } from '../../api/tags.js';
import { setActiveTags } from './tag.js';
import { columns } from './tagselector';

import './tagcolumn.html';


export function createNewColumn() {
    const tagselectorElement = document.getElementById("tagselector");
    Blaze.render(Template.tagcolumn, tagselectorElement);
    columns.push(tagselectorElement.lastChild);
}

Template.tagcolumn.helpers({
    tags() {
        return Tags.find({}, { sort: { name : 1}});
    }
});

Template.tagcolumn.events({
    'click .reset-tag-filter'() {
        setActiveTags([]);
        disableReset();
        var lastColumn = columns.pop();
        lastColumn.parentNode.removeChild(lastColumn);
    },
});

function disableReset() {
    document.getElementById("reset-tag-0").classList.add("disabled");
}

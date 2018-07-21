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
        return Tags.find({}, { sort: { name: 1 } });
    },
    index() {
        return columns.length;
    }
});

Template.tagcolumn.events({
    'click .reset-tag-filter'(event) {
        var column = event.target.id.substring('reset-tag-'.length);
        console.log('reset tag in column ', column)
        setActiveTags([]);
        disableResetInColumn(column);
        if (columns.length > 1) {
            var lastColumn = columns.pop();
            lastColumn.parentNode.removeChild(lastColumn);
        }
    },
});

function disableResetInColumn(column) {
    document.getElementById("reset-tag-"+column).classList.add("disabled");
}

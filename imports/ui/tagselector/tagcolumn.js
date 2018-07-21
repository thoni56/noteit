import { Template } from 'meteor/templating';
import { Tags } from '../../api/tags.js';
import { setActiveTags, getActiveTags } from './tag.js';
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
        const columnIndex = Number(event.target.id.slice('reset-tag-'.length));
        console.log('reset tag in column ', columnIndex)
        let tags = getActiveTags();
        if (columnIndex == 0) {
            tags = [];
        } else {
            tags = tags.slice(columnIndex-1);
        }
        setActiveTags(tags);
        disableResetInColumn(columnIndex);
        while (columns.length > columnIndex+1) {
            const column = columns.pop();
            column.parentNode.removeChild(column);
        }
    },
});

function disableResetInColumn(column) {
    document.getElementById("reset-tag-"+column).classList.add("disabled");
}

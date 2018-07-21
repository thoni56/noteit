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
        const columnIndex = event.target.id.slice('reset-tag-'.length);
        console.log('reset tag in column ', columnIndex)
        setActiveTags([]);
        disableResetInColumn(columnIndex);
        if (columns.length > 1) {
            const lastColumn = columns.pop();
            lastColumn.parentNode.removeChild(lastColumn);
        }
    },
});

function disableResetInColumn(column) {
    document.getElementById("reset-tag-"+column).classList.add("disabled");
}

import { Template } from 'meteor/templating';
import './tagselector.html';
import { Tags } from '../../api/tags';


export function setActiveTags(tagList) {
    activeTags.set(tagList);
}

export function getActiveTags() {
    return activeTags.get();
}

// The activeTags always contain a last element which is undefined.
// It means that there is no tag selected in that column, but since
// that column needs to be present we need this extra element.
const activeTags = new ReactiveVar([undefined]);

Template.tagselector.helpers({
    columns() {
        return getActiveTags();
    },
    tags() {
        return Tags.find();
    },
    active(columnIndex) {
        if (this._id == selectedTagInColumn(columnIndex)) {
            return "active";
        } else {
            return "";
        }
    }
});

Template.tagselector.events({
    'click .tag'(event) {
        const columnIndex = Number(event.target.parentNode.id.slice('tag-column-'.length));
        console.log('select tag in column ' + columnIndex + ' = ' + this._id);
        pushTag(this._id);
        enableResetInColumn(columnIndex);
    },
    'click .reset-tag-filter'(event) {
        const columnIndex = Number(event.target.id.slice('reset-tag-'.length));
        console.log('reset tag in column ', columnIndex)
        popTags(columnIndex);
        disableResetInColumn(columnIndex);
    }
});

function selectedTagInColumn(columnIndex) {
    const tags = getActiveTags();
    const tag = tags[columnIndex];
    return tag;
}

function popTags(columnIndex) {
    let tags = getActiveTags();
    tags = tags.slice(0, columnIndex);
    tags.push(undefined);
    setActiveTags(tags);
}

function pushTag(id) {
    const tags = getActiveTags();
    tags.splice(tags.length - 1, 0, id);
    setActiveTags(tags);
}

function enableResetInColumn(column) {
    document.getElementById("reset-tag-" + column).classList.remove("disabled");
}

function disableResetInColumn(column) {
    document.getElementById("reset-tag-" + column).classList.add("disabled");
}
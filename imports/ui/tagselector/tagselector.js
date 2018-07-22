import { Template } from 'meteor/templating';
import './tagselector.html';
import { Tags } from '../../api/tags';


export function getActiveTags() {
    let tags = activeTags.get();
    tags = tags.slice(0, tags.length-1);
    return tags;
}

// The activeTags always contain a last element which is undefined.
// It means that there is no tag selected in that column, but since
// that column needs to be present we need this extra element.
const activeTags = new ReactiveVar([undefined]);

Template.tagselector.helpers({
    columns() {
        return activeTags.get();
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
    },
    'click .edit-tag'() {
        console.log("edit tag ", this._id);
    }
});

function selectedTagInColumn(columnIndex) {
    const tags = activeTags.get();
    const tag = tags[columnIndex];
    return tag;
}

function popTags(columnIndex) {
    let tags = activeTags.get();
    tags = tags.slice(0, columnIndex);
    tags.push(undefined);
    activeTags.set(tags);
}

function pushTag(id) {
    const tags = activeTags.get();
    tags.splice(tags.length - 1, 0, id);
    activeTags.set(tags);
}

function enableResetInColumn(column) {
    document.getElementById("reset-tag-" + column).classList.remove("disabled");
}

function disableResetInColumn(column) {
    document.getElementById("reset-tag-" + column).classList.add("disabled");
}
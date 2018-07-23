import { Template } from 'meteor/templating';
import './tagselector.html';
import { Tags } from '../../api/tags';


export function getActiveTags() {
    let tags = activeTags.get();
    tags = tags.slice(0, tags.length-1);
    return tags;
}

// The activeTags always contain a last element which is undefined. This means
// that there is no tag selected in that column, but since generating templates
// for all visible column we use this extra element to provide the last column.
const activeTags = new ReactiveVar([undefined]);

Template.tagselector.helpers({
    columns() {
        // Need this many columns
        return activeTags.get();
    },
    tags(columnIndex) {
        return filteredTags(Tags.find(), columnIndex, activeTags.get());
    },
    active(columnIndex) {
        if (this._id == selectedTagInColumn(columnIndex)) {
            return "active";
        } else {
            return "";
        }
    },
    disabled(columnIndex) {
        if (activeTags.get().length == columnIndex+1) {
            return "disabled";
        }
    }
});

Template.tagselector.events({
    'click .tag'(event) {
        const columnIndex = Number(event.target.parentNode.id.slice('tag-column-'.length));
        popTagsUpto(columnIndex);
        pushTag(this._id);
    },
    'click .reset-tag-filter'(event) {
        const columnIndex = Number(event.target.id.slice('reset-tag-'.length));
        popTagsUpto(columnIndex);
    },
    'click .edit-tag'(event) {
        console.log("edit tag ", this._id);
    }
});

function filteredTags(tags, columnIndex, activeTags) {
    const tag = activeTags[0];
    const notes = notesWithTag(tag);
    return tags;
}

function selectedTagInColumn(columnIndex) {
    const tags = activeTags.get();
    const tag = tags[columnIndex];
    return tag;
}

function popTagsUpto(columnIndex) {
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
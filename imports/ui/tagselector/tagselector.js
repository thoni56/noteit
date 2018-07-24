import { Template } from 'meteor/templating';
import { Tags } from '../../api/tags';
import { notesWithTags } from '../../api/notes';

import './tagselector.html';


export function getActiveTags() {
    let tags = columnTags.get();
    tags = tags.slice(0, tags.length - 1);
    return tags;
}

// The columnTags always contain a last element which is 'undefined' to maintain
// a length which is as long as the number of columns required. The 'undefined'
// value means that there is no tag selected in that column. To get the actual
// active tags the last value need to be removed.
const columnTags = new ReactiveVar([undefined]);

Template.tagselector.helpers({
    columns() {
        // Need this many columns
        return columnTags.get();
    },
    tagsInColumn(columnIndex) {
        if (columnIndex >= columnTags.get().length) {
            // column is being removed, but reactively redrawn until it is
            return [];
        }

        const activeTags = columnTags.get().slice(0, columnIndex);
        return potentialNextTags(activeTags);
    },
    active(columnIndex) {
        if (this._id == selectedTagInColumn(columnIndex)) {
            return "active";
        } else {
            return "";
        }
    },
    disabled(columnIndex) {
        if (columnTags.get().length == columnIndex + 1) {
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

function potentialNextTags(tagNames) {
    if (tagNames.length == 0) {
        return Tags.find();
    }

    // Get notes with all tags previous to columnIndex
    const notes = notesWithTags(tagNames);
    // Collect all tags from those notes
    const nextTagNames = new Set();
    notes.forEach(function (note) {
        note.tags.forEach(function (tag) {
            nextTagNames.add(tag);
        });
    });
    // Remove all previous tags from the set
    tagNames.forEach(function (tag) {
        nextTagNames.delete(tag);
    })
    // Return a collection of Tags
    const tags = Array.from(nextTagNames);
    return Tags.find({ _id: { $in: tags } });
}

function selectedTagInColumn(columnIndex) {
    const tags = columnTags.get();
    const tag = tags[columnIndex];
    return tag;
}

function popTagsUpto(columnIndex) {
    let tags = columnTags.get();
    tags = tags.slice(0, columnIndex);
    tags.push(undefined);
    columnTags.set(tags);
}

function pushTag(id) {
    const tags = columnTags.get();
    tags.splice(tags.length - 1, 0, id);
    columnTags.set(tags);
}
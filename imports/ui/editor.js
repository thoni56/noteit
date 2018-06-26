import { Template } from 'meteor/templating';
import SimpleMDE from 'simplemde';
import { Notes } from '../api/notes';
import { Tags } from '../api/tags';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveArray } from 'meteor/manuel:reactivearray';
 
import './editor.html';

import './notetag.js';

export var editor;
export var currentNote = new ReactiveVar(null);

var tags = new ReactiveArray();

export function load(note_id) {
    save();
    currentNote = note_id;
    var note = Notes.findOne({_id: note_id});
    titleField().value = note.title;
    if (note.content === null) {
        editor.value("");
    } else {
        editor.value(note.content);
    }
    tags.clear();
    if (note.tags) {
        tags = tags.concat(note.tags);
    }
    console.log(Tags.find({ _id: { $in : tags }}).fetch());
}

export function save() {
    const title = document.getElementById('note-title').value.trim();
 
    if (!editorIsEmpty(title)) {
        if (!editingExistingNote()) {
            // Insert the note in the collection
            currentNote = Notes.insert({
                title: title,
                content: editor.value(),
                createdAt: new Date(),
            });
        } else {
            Notes.update(currentNote, {
                $set: { title: title,
                        content: editor.value(),
                        modifiedAt: new Date(),
                },
            });
        }
    }
}

Template.editor.onRendered(function () {
  editor = new SimpleMDE({element: document.getElementById("editor")});
});

Template.editor.helpers({
    notetags() {
        return Tags.find({ _id: { $in : tags }});
    }, 
});

Template.editor.events({
    'submit .edit-title'(event) {
        // Prevent default browser submit
        event.preventDefault();

        save();
        const title = titleField().value.trim();
        if (!editorIsEmpty(title)) {
            editor.codemirror.focus();
        }
    },

    'submit .edit-tags'(event) {
        event.preventDefault();
        let tagname = tagsField().value.trim();
        let tag = Tags.findOne({name: tagname});
        if (tag) {
            tags.push(tag._id);
            tagsField.value = '';
            event.target.reset();
            Notes.update(currentNote, {
                $set: { tags: tags}
            });
        }
    },

    'click .add-note'(event) {
        if (event.detail === 0) {
            // This was not an actual click, but a click generate by enter in the input field
            return;
        }

        event.preventDefault();
        resetEditor(event.target);
    },

    'click .delete-note'(event) {
        Notes.remove(currentNote);
        resetEditor();
    }
});

function tagsField() {
    return document.getElementById('add-tag');
}

function titleField() {
    return document.getElementById('note-title');
}

function editingExistingNote() {
    return currentNote && Notes.find({_id:currentNote}).count();
}

function editorIsEmpty(title) {
    return title.length == 0 && editor.value().length == 0; 
}

function resetEditor() {
    titleField().value = '';
    document.getElementById('edit-title-form').reset(); // Reset the form
    currentNote = null;
    editor.value('');
}

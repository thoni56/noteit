import { Template } from 'meteor/templating';
import SimpleMDE from 'simplemde';
import { Notes } from '../api/notes';
import { Tags } from '../api/tags';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveArray } from 'meteor/templates:array';
import { Confirmation } from 'meteor/matdutour:popup-confirm';
 
import './editor.html';

import './notetag.js';

export var editor;
export var currentNote = new ReactiveVar(null);

var tagsField;
var titleField;

var tags = ReactiveVar([]);

export function load(note_id, noteTags) {
    save();
    currentNote = note_id;
    var note = Notes.findOne({_id: note_id});
    titleField.value = note.title;
    if (note.content === null) {
        editor.value("");
    } else {
        editor.value(note.content);
    }
    if (noteTags) {
        tags.set(noteTags);
    } else {
        tags.set([]);
    }
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
            resetTags();
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
    tagsField = document.getElementById('add-tag');
    titleField = document.getElementById('note-title')
});

Template.editor.helpers({
    notetags() {
        return Tags.find({ _id: { $in : tags.get() }});
    }, 
});

Template.editor.events({
    'submit .edit-title-form'(event) {
        // Prevent default browser submit
        event.preventDefault();

        save();
        const title = titleField.value.trim();
        if (!editorIsEmpty(title)) {
            editor.codemirror.focus();
        }
    },

    'submit .edit-tags-form'(event) {
        event.preventDefault();
        if (currentNote) {
            let tagname = tagsField.value.trim();
            let tag = Tags.findOne({name: tagname});
            if (!tag) {
                new Confirmation({
                    message: "Do you want to create the new tag '"+tagname+"' ?",
                    title: "Create new tag?",
                    cancelText: "No",
                    okText: "Yes",
                    success: true,
                    focus: "cancel"
                }, function (ok) {
                    if (ok) {
                        Tags.insert({name: tagname});
                        tag = Tags.findOne({name: tagname});
                        addTag(tag, event.target);
                    }
                })
            } else {
                addTag(tag, event.target);
            }
        }
    },

    'click .add-note'(event) {
        if (event.detail === 0) {
            // This was not an actual click, but a click generate by enter in the input field
            return;
        }

        event.preventDefault();
        resetEditor();
    },

    'click .delete-note'(event) {
        Notes.remove(currentNote);
        resetEditor();
    }
});

function addTag(tag, target) {
    const tagsArray = tags.get();
    if (!tagsArray.includes(tag._id)) {
        tagsArray.push(tag._id);
        tags.set(tagsArray);
        tagsField.value = '';
        target.reset();
        Notes.update(currentNote, {
            $set: { tags: tagsArray }
        });
    }
}

function editingExistingNote() {
    return currentNote && Notes.find({_id:currentNote}).count();
}

function editorIsEmpty(title) {
    return title.length == 0 && editor.value().length == 0; 
}

function resetEditor() {
    currentNote = null;
    resetTitle();
    resetContent();
    resetTags();
}

function resetTitle() {
    titleField.value = '';
    document.getElementById('edit-title-form').reset();
}

function resetContent() {
    editor.value('');
}

function resetTags() {
    tags.set([]);
    tagsField.value = '';
    document.getElementById('edit-tags-form').reset();
}


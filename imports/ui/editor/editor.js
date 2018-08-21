import { Template } from 'meteor/templating';
import SimpleMDE from 'simplemde';
import { createNote, getNote, deleteNote, updateNote, tagsForNote, addTagToNote } from '../../api/notes.js';
import { Tags } from '../../api/tags.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { Confirmation } from 'meteor/matdutour:popup-confirm';
import { setActive } from '../notelist/note.js';
 
import './editor.html';

export var editor;
export var currentNoteId = new ReactiveVar(null);

var tagsField;
var titleField;

var tags = ReactiveVar([]);

export function load(noteId) {
    save();
    currentNoteId.set(noteId);
    const note = getNote(noteId);
    titleField.value = note.title;
    if (note.content === null) {
        editor.value("");
    } else {
        editor.value(note.content);
    }
    tags.set(tagsForNote(noteId));
    document.getElementById('edit-tags-form').reset();
}

export function save() {
    const title = document.getElementById('note-title').value.trim();
 
    if (!editorIsEmpty(title)) {
        if (!editingExistingNote()) {
            currentNoteId.set(createNote(title, editor.value()));
            resetTags();
        } else {
            updateNote(currentNoteId.get(), title, editor.value());
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
        if (currentNoteId.get()) {
            const tagname = tagsField.value.trim();
            let tag = Tags.findOne({name: tagname});
            const tagform = event.target;
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
                        Tags.insert({name: tagname, owner: Meteor.userId()});
                        tag = Tags.findOne({name: tagname});
                        addTagToNote(tag, currentNote.get());
                        tags.set(tagsForNote(currentNote.get()));
                        tagform.reset();
                    }
                })
            } else {
                addTagToNote(tag, currentNoteId.get());
                tags.set(tagsForNote(currentNoteId.get()));
                tagform.reset();
            }
        }
    },

    'click .add-note'(event) {
        if (event.detail === 0) {
            return;     // Not an actual click, but a click generated by enter in the title field
        }

        event.preventDefault();
        save();
        resetEditor();
        setActive(undefined);
    },

    'click .delete-note'(event) {
        if (event.detail === 0) {
            return;     // Not an actual click, but a click generate by enter in the title field
        }

        deleteNote(currentNoteId.get());
        resetEditor();
        setActive(undefined);
    }
});

function editingExistingNote() {
    return currentNoteId.get() && getNote(currentNoteId.get());
}

function editorIsEmpty(title) {
    return title.length == 0 && editor.value().length == 0; 
}

function resetEditor() {
    currentNoteId.set(null);
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


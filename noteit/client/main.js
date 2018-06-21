import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import SimpleMDE from 'simplemde';
import {} from 'simplemde/src/css/simplemde.css';

import './main.html';

Template.editor.onRendered(function helloOnCreated() {
  new SimpleMDE({element: document.getElementById("textarea")});
}); 

Template.editor.helpers({
  notes: [
    ],
});


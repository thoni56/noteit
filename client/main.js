import { Template } from 'meteor/templating';
import SimpleMDE from 'simplemde';

import '../imports/ui/body.js';
import '../imports/ui/editor.js';

export let editor;


Template.editor.onRendered(function () {
  editor = new SimpleMDE({element: document.getElementById("editor")});
});
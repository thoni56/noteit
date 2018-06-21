import { Template } from 'meteor/templating';
import SimpleMDE from 'simplemde';

import '../imports/ui/body.js';

export let editor;


Template.editor.onRendered(function () {
  editor = new SimpleMDE({element: document.getElementById("editor")});
});
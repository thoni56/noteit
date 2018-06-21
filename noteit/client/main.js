import { Template } from 'meteor/templating';
import SimpleMDE from 'simplemde';

import '../imports/ui/body.js';

Template.editor.onRendered(function helloOnCreated() {
  new SimpleMDE({element: document.getElementById("editorarea")});
});

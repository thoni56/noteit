import '../imports/startup/accounts-config.js';
import '../imports/ui/body.js';
import '../imports/ui/editor/editor.js';
import '../imports/ui/editor/notetag.js';
import '../imports/ui/notelist/notelist.js';
import '../imports/ui/tagselector/tagselector.js';

Meteor.subscribe('Notes');
Meteor.subscribe('Tags');
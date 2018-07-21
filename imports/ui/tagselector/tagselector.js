import { Template } from 'meteor/templating';
import { createNewColumn } from './tagcolumn';

import './tagselector.html';

export var columns = [];


Template.tagselector.onRendered(function () {
    createNewColumn();
});

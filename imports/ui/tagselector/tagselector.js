import { Template } from 'meteor/templating';
import { Tags } from '../../api/tags.js';
import { setActiveTags } from './tag.js';
import { createNewColumn } from './tagcolumn';

import './tagselector.html';

export var columns = [];


Template.tagselector.onRendered(function () {
    createNewColumn();
});

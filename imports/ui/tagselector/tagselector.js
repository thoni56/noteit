import { Template } from 'meteor/templating';
import { createNewColumn } from './tagcolumn';

import './tagselector.html';

export const columns = [];


Template.tagselector.onRendered(function () {
    createNewColumn();
});

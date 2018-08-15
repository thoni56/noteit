import { Template } from 'meteor/templating';
import { serializeAllNotes, convertSerializedNotesToCSV } from './exporter/exporter';
import { saveAs } from 'file-saver/FileSaver';

import './body.html';

Template.body.events({
    'click #exportCSVlink': function () {
        exportCSV({ filename: "export.csv"});
    }
});

function exportCSV() {
    const csv = convertSerializedNotesToCSV(serializeAllNotes());
    const blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
    saveAs(blob, "export.csv");
}
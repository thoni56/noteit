import { Template } from 'meteor/templating';
import { serializeAllNotes, convertSerializedNotesToCSV } from './exporter/exporter';
import { csvImporter } from './importer/importer';
import { saveAs } from 'file-saver/FileSaver';

import './body.html';

Template.body.events({
    'click #exportCSVlink': function () {
        exportCSV({ filename: "export.csv" });
    },
    'click #importCSVlink': function () {
        const element = document.getElementById("importFileName");
        element.click();
    },
    'change #importFileName'(event) {
        importCSV(event.target.files[0]);
    }
});

function exportCSV() {
    const csv = convertSerializedNotesToCSV(serializeAllNotes());
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "noteit-export.csv");
}

function importCSV(file) {
    console.log(file);
    const reader = new FileReader(file);
    reader.onload = function () {
        csvImporter(reader.result);
    };
    reader.readAsText(file);
}

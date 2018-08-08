import { Template } from 'meteor/templating';
import { serializeAllNotes, convertSerializedNotesToCSV } from './exporter/exporter';

import './body.html';

Template.body.events({
    'click #exportCSVlink': function () {
        exportCSV({ filename: "export.csv"});
    }
});

function exportCSV(args) {
    var data, filename, link;
    var csv = convertSerializedNotesToCSV(serializeAllNotes());
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}
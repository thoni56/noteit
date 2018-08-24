import { createNote } from '../../api/notes';
import { Papa } from 'meteor/harrison:papa-parse';

export function csvImporter(string) {
    if (string) {
        const results = Papa.parse(string.trim(), { header: true });
        if (results.data.length > 0) {
            createNote(results.data[0].title, results.data[0].content);
        }
    } 
}
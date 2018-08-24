import { createNote } from '../../api/notes';
import { Papa } from 'meteor/harrison:papa-parse';

export function csvImporter(string) {
    if (string) {
        const results = Papa.parse(string.trim(), { header: true });
        if (results.data.length > 0) {
            results.data.forEach(element => {
                createNote(element.title, element.content);                
            });
        }
    } 
}
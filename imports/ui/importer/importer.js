import { createNote } from '../../api/notes';
import { Papa } from 'meteor/harrison:papa-parse';

export function csvImporter(string) {
    if (string) {
        const results = Papa.parse(string.trim(), { header: true, skipEmptyLines: true });
        if (results.data.length > 0) {
            results.data.forEach(element => {
                const content = element.content?element.content.replace(/\\\\n/, "\n"):"";
                createNote(element.title, content);                
            });
        }
    } 
}
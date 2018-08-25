import { createNote, addTagIdToNote } from '../../api/notes';
import { Tags } from '../../api/tags';
import { Papa } from 'meteor/harrison:papa-parse';

export function csvImporter(string) {
    if (string) {
        const results = Papa.parse(string.trim(), { header: true, skipEmptyLines: true });
        if (results.data.length > 0) {
            results.data.forEach(element => {
                const content = element.content?element.content.replace(/\\\\n/, "\n"):"";
                importNote(element, content); 
            });
        }
    } 
}

function importNote(element, content) {
    const note = createNote(element.title, content);
    if (element.tags) {
        const tag = Tags.findOne({ name: element.tags });
        let tagId;
        if (!tag) {
            tagId = Tags.insert({ name: element.tags });
        } else {
            tagId = tag._id;
        } 
        addTagIdToNote(tagId, note);
    }
}

import { createNote } from '../../api/notes';

export function csvImporter(string) {
    if (string) {
        createNote("title", "content");
    } 
}
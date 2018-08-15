/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { notesWithTags, createNote, Notes } from './notes';


if (Meteor.isServer) {
    describe("the server", function () {
        it("finds no notes initially", function () {

            const notes = notesWithTags([]);

            expect(notes.count()).to.equal(0);
        })
    })
};

if (Meteor.isClient){
    describe("notes on the client", function () {
        it("creates notes with userId", function (){
            const id = createNote();
            const note = Notes.findOne({_id: id});
            expect(note).to.have.property("owner");
        })
    })
} 
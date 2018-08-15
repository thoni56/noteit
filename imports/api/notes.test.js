/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { notesWithTags } from './notes';


if (Meteor.isServer) {
    describe("the server", function () {
        it("finds no notes initially", function () {

            const notes = notesWithTags([]);

            expect(notes.count()).to.equal(0);
        })
    });
};

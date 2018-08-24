import { Meteor } from 'meteor/meteor';
import { Notes } from '../../api/notes';
import { Tags } from '../../api/tags';
import { expect } from 'chai';
import StubCollections from 'meteor/hwillson:stub-collections';
import { csvImporter } from './importer';

if (Meteor.isServer) {
    beforeEach(function () {
        StubCollections.add(Notes, Tags);
        StubCollections.stub();
        Notes.remove({});
        Tags.remove({});
        sinon.stub(Meteor, 'userId');
        Meteor.userId.returns(42);
    });

    afterEach(function () {
        Notes.remove({});
        Tags.remove({});
        StubCollections.restore();
        Meteor.userId.restore();
    });
    
    describe("CSV importer", function () {
        it("creates no documents for empty string", function () {
            csvImporter("");
            expect(Notes.find().count()).to.equal(0);
        }),
        it("creates one document for one line", function () {
            csvImporter("A Title");
            expect(Notes.find().count()).to.equal(1);
        }),
        it("creates document with title", function () {
            csvImporter("A Title");
            const note = Notes.findOne();
            expect(note.title).to.equal("A Title");
        })
    })
}
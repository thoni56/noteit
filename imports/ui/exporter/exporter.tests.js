import { Meteor } from 'meteor/meteor';
import { Notes } from '../../api/notes';
import { Tags } from '../../api/tags';
import { expect } from 'chai';
import StubCollections from 'meteor/hwillson:stub-collections'; 
import { convertSerializedNotesToCSV } from './exporter';
import { serializeAllNotes } from './exporter';


if (Meteor.isServer) {
    describe("CSV converter", function () {
        it("returns only headers for no notes", function () {
            let notes = [];
            expect(convertSerializedNotesToCSV(notes)).to.equal("title,content,tags\n");
        }),
        it("returns a line with the title in quotes", function () {
            let notes = [{title: "Title"}];
            expect(convertSerializedNotesToCSV(notes)).to.contain('"Title"');
        }),
        it("exports the content", function () {
            let notes = [{title: "Title", content: "This is the content"}];
            expect(convertSerializedNotesToCSV(notes)).to.contain('"This is the content"');
        }),
        it("exports tags as a single field with comma separated tagnames", function () {
            let notes = [{title: "Title", content: "This is the content", tags: ['tag1', 'tag2']}];
            expect(convertSerializedNotesToCSV(notes)).to.contain('"tag1,tag2"');
        })
    }),
    describe("Note serializer", function () {
        beforeEach(function () {
            StubCollections.add(Notes, Tags);
            StubCollections.stub();
            Notes.remove({});
            Tags.remove({});
        });

        afterEach(function () {
            Notes.remove({});
            Tags.remove({});
            StubCollections.restore();
        });

        it("serialized no notes to an empty array", function () {
            expect(serializeAllNotes()).to.have.length(0);
        }),

        it("serializes a single note to an array of one element", function () {
            Notes.insert( { title: "Title" });
            const serializedNotes = serializeAllNotes();
            expect(serializedNotes).to.have.length(1);
            expect(serializedNotes[0]).to.have.property('title', "Title");
        }),

        it("serializes two notes to an array of two elements", function () {
            Notes.insert( { title: "Title1" });
            Notes.insert( { title: "Title2" });
            const serializedNotes = serializeAllNotes();
            expect(serializedNotes).to.have.length(2);
        }),

        it("only retains title, content and tags (should also retain dates)", function () {
            Tags.insert( { _id: "1", name: "tag1"});
            Tags.insert( { _id: "2", name: "tag2"});
            Notes.insert({ _id: "sdkfj", title: "Title", content: "Content", tags: ["1", "2"] } );
            const serializedNotes = serializeAllNotes();
            expect(serializedNotes).to.have.length(1);
            const serializedNote = serializedNotes[0];
            expect(serializedNote).to.not.have.property('id');
            expect(serializedNote).to.have.property('title', "Title");
            expect(serializedNote).to.have.property('content', "Content");
            expect(serializedNote).to.have.property('tags', "tag1,tag2");
        }),
        it("exports newlines in content as \\\\n", function () {
            Notes.insert({ _id:"laskdf", title: "Title", content: "Content\nwith\nnewlines"} );
            const serializedNotes = serializeAllNotes();
            const serializedNote = serializedNotes[0];
            expect(serializedNote).to.have.property('content', "Content\\\\nwith\\\\nnewlines");
        } )
    })
};

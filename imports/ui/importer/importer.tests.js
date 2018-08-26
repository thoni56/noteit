import { Meteor } from 'meteor/meteor';
import { Notes } from '../../api/notes';
import { Tags, createTag } from '../../api/tags';
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
        const header = "title,content,tags\n";
        it("creates no documents for empty string", function () {
            csvImporter("");
            expect(Notes.find().count()).to.equal(0);
        }),
        it("creates no documents for only header line", function () {
            csvImporter(header);
            expect(Notes.find().count()).to.equal(0);
        }),
        it("creates one document for one line", function () {
            csvImporter(header+"A Title,content");
            expect(Notes.find().count()).to.equal(1);
        }),
        it("creates three document for three line", function () {
            const lines = ["A Title,content",
                            "Another title,with more content",
                            "Last title,and last content"
                        ];
            csvImporter(header+lines.join("\n"));
            expect(Notes.find().count()).to.equal(3);
        }),
        it("creates document with title", function () {
            csvImporter(header+"A Title");
            const note = Notes.findOne();
            expect(note.title).to.equal("A Title");
        }),
        it("allows commas in title if inside quotes", function () {
            csvImporter(header+"\"A title, with comma\", content");
            const note = Notes.findOne();
            expect(note.title).to.equal("A title, with comma");
        }),
        it("allows newlines in content if they are represented as \\\\n", function () {
            csvImporter(header+"\"A title\",\"contains\\\\nnew line\"");
            const note = Notes.findOne();
            expect(note.content).to.equal("contains\nnew line");
        }),
        it("stores a tag id if the tag exists", function () {
            const id = createTag("tag");
            csvImporter(header+"\"A title\",\"content\",tag");
            const note = Notes.findOne();
            expect(note.tags).to.deep.equal([id]);
        }),
        it("creates and add a tag id if the tag doesn't exists", function () {
            csvImporter(header+"\"A title\",\"content\",tag");
            const tag = Tags.findOne();
            const note = Notes.findOne();
            expect(note.tags).to.deep.equal([tag._id]);
        }),
        it("creates and adds two tags", function () {
            const tagId1 = createTag("tag1");
            csvImporter(header+"\"A title\",\"content\",\"tag1,tag2\"");
            expect(Tags.find().count()).to.equal(2);
            const tagId2 = Tags.findOne({name: "tag2"})._id;
            const note = Notes.findOne();
            expect(note.tags).to.contain(tagId1);
            expect(note.tags).to.contain(tagId2);
        })
    })
}
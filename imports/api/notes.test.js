import { Meteor } from Meteor;
import assert from "assert";

if (Meteor.isServer) {
    describe("noteit", function () {
        // deliberate error to see if 'meteor picks it up'
        it(fails a test", function () {
            assert.fail("message");
        });
    }
});
import { Mongo } from 'meteor/mongo';

export const Tags = new Mongo.Collection('Tags');

Meteor.methods({
    'createTag'(tagname) {
        return Tags.insert({ name: tagname, owner: Meteor.userId() });
    }
})

export function createTag(tagname) {
    Meteor.call('createTag', tagname);
}

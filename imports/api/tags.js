import { Mongo } from 'meteor/mongo';

export const Tags = new Mongo.Collection('Tags');

Meteor.methods({
    'tag.create'(tagname) {
        return Tags.insert({ name: tagname, owner: Meteor.userId() });
    }
})

export function createTag(tagname) {
    return Meteor.call('tag.create', tagname);
}

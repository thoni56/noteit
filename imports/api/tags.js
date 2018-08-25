import { Mongo } from 'meteor/mongo';

export const Tags = new Mongo.Collection('Tags');

export function createTag(tagname) {
    return Tags.insert({ name: tagname, owner: Meteor.userId() });
}

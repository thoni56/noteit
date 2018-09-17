import { Meteor } from 'meteor/meteor';
import { Notes } from '../imports/api/notes';
import { Tags } from '../imports/api/tags';

Meteor.startup(() => {

  Meteor.publish('Notes', function() {
    let currentUser = this.userId;
    return Notes.find({owner: currentUser});
  });

  Meteor.publish('Tags', function() {
    let currentUser = this.userId;
    return Tags.find({owner: currentUser});
  });
});


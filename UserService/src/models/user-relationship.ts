import mongoose, { Schema } from "mongoose";

//interface to define required properties for attributes
interface UserRelationshipAttributes {
  firstUserId: string;
  secondUserId: string;
  status: string;
}

//interface to define properties of a model
interface UserRelationshipModel
  extends mongoose.Model<UserRelationshipDocument> {
  build(attrs: UserRelationshipAttributes): UserRelationshipDocument;
}

// interface to describe propreties of a document
interface UserRelationshipDocument extends mongoose.Document {
  firstUserId: string;
  secondUserId: string;
  createdOn: Date;
  status: string;
}

const userRelationshipSchema = new mongoose.Schema({
  firstUserId: {
    type: String,
    required: true,
  },
  secondUserId: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
  },
});

userRelationshipSchema.statics.build = (attrs: UserRelationshipDocument) => {
  return new UserRelationship(attrs);
};

const UserRelationship = mongoose.model<
  UserRelationshipDocument,
  UserRelationshipModel
>("UserRelationship", userRelationshipSchema);

export { UserRelationship };

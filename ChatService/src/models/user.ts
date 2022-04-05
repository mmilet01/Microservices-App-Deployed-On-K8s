import mongoose from "mongoose";

//interface to define required properties for a user
interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  photoPath: string;
}

//interface to define properties of a user model
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttributes): UserDocument;
  findByEvent(event: { id: string }): Promise<UserDocument | null>;
}

// interface to describe propreties of a user document
interface UserDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  createdOn: Date;
  photoPath: string;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
    photoPath: {
      type: String,
    },
  },
  {
    // document to object options
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.statics.findByEvent = (event: { id: string }) => {
  return User.findOne({
    _id: event.id,
  });
};

userSchema.statics.build = (attrs: UserAttributes) => {
  return new User({
    _id: attrs.id,
    firstName: attrs.firstName,
    lastName: attrs.lastName,
  });
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

//interface to define required properties for a user
interface UserAttributes {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  photoPath: string;
}

//interface to define properties of a user model
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttributes): UserDocument;
}

// interface to describe propreties of a user document
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdOn: Date;
  photoPath: string;
  validatePassword(password: string): Promise<any>;
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
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
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
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (!this.isModified("password")) return done();
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(this.get("password"), salt);
    this.set("password", hashedPassword);
    done();
  } catch (err: any) {
    done(err);
  }
});

userSchema.methods.validatePassword = async function validatePassword(
  data: any
) {
  return await bcrypt.compare(data, this.get("password"));
};

userSchema.statics.build = (attrs: UserAttributes) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };

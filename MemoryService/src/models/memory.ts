import mongoose from "mongoose";

//interface to define required properties for a user
interface MemoryAttributes {
  title: string;
  description: string;
  createdBy: string;
  photoPath: string;
  userPhotoPath: string;
  userName: string;
}

interface MemoryModel extends mongoose.Model<MemoryDocument> {
  build(attrs: MemoryAttributes): MemoryDocument;
}

// interface to describe propreties of a user document
interface MemoryDocument extends mongoose.Document {
  title: string;
  description: string;
  createdBy: string;
  createdOn: Date;
  photoPath: string;
  userPhotoPath: string;
  userName: string;
}

const memorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  userPhotoPath: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  taggedOn: [
    {
      userId: String,
      fullname: String,
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
  photoPath: {
    type: String,
  },
});

memorySchema.statics.build = (attrs: MemoryDocument) => {
  return new Memory(attrs);
};

const Memory = mongoose.model<MemoryDocument, MemoryModel>(
  "Memory",
  memorySchema
);

export { Memory };

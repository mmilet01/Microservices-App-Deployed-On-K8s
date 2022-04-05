import mongoose from "mongoose";

//interface to define required properties for a Message
interface MessageAttributes {
  from: string;
  to: string;
  message: string;
}

//interface to define properties of a Message model
interface MessageModel extends mongoose.Model<MessageDocument> {
  build(attrs: MessageAttributes): MessageDocument;
}

// interface to describe propreties of a Message document
interface MessageDocument extends mongoose.Document {
  from: string;
  to: string;
  message: string;
}

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    sentOn: {
      type: Date,
      default: Date.now,
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

messageSchema.statics.build = (attrs: MessageAttributes) => {
  return new Message({
    from: attrs.from,
    to: attrs.to,
    message: attrs.message,
  });
};

const Message = mongoose.model<MessageDocument, MessageModel>(
  "Message",
  messageSchema
);

export { Message };

import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  UserCreatedEvent,
} from "@mmilet-microservices/common";
import { User } from "../../models/user";
import { queueGroupName } from "./queue-group-name";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent["data"], msg: Message) {
    const { id, firstName, lastName, email, photoPath } = data;

    const user = User.build({
      id,
      firstName,
      lastName,
      photoPath,
    });
    await user.save();

    msg.ack();
  }
}

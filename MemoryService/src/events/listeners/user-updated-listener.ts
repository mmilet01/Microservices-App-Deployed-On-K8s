import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  UserUpdatedEvent,
} from "@mmilet-microservices/common";
import { User } from "../../models/user";
import { queueGroupName } from "./queue-group-name";

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent["data"], msg: Message) {
    const user = await User.findByEvent(data);

    if (!user) {
      throw new Error("User not found");
    }

    const { firstName, lastName } = data;
    user.set({ firstName, lastName });
    await user.save();

    msg.ack();
  }
}

import {
  Publisher,
  Subjects,
  UserCreatedEvent,
} from "@mmilet-microservices/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}

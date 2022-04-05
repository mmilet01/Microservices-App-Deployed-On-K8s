import {
  Publisher,
  Subjects,
  UserUpdatedEvent,
} from "@mmilet-microservices/common";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  readonly subject = Subjects.UserCreated;
}

export interface IMemory {
  id: string;
  title: string;
  description: string;
  photoPath: string[];
  userPhotoPath: string;
  userName: string;
  createdOn: Date;
  createdBy: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  message: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoPath: string;
  createdOn: Date;
}

export interface socketMessagePayaload {
  messageObj: Message;
  selectedId: string;
}

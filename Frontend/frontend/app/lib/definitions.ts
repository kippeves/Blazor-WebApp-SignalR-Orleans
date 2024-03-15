// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

import { UUID } from "crypto"

// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  token: string;
};

export type PrefetchData = {
  User: User,
  Messages: ChatMessage[],
  Settings: AppSettings,
  Channels: ChatChannel[]
}

export type AppSettings = {
  MenuIsOpen: boolean
  ActiveChannel: UUID
}

export type ChatMessage = {
  Id: UUID,
  Time: string,
  User: string,
  //    User: SessionUser,
  Message: string
}

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export type ChatChannel = {
  id: UUID,
  name: string
}
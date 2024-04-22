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
  Messages: MessageObj[],
  Settings: AppSettings,
  Channels: ChannelObj[]
}

export type AppSettings = {
  menuIsOpen: boolean
  activeChannel: UUID
}
export type JoinChannelEvent = {
  channelId: UUID,
  channelName: string
}

export enum ClientState {
  Joined,
  Switching,
  NotConnected,
}

export type MessageResponse = {
  channelId: UUID,
  message: MessageObj
}

export type MessageObj = {
  id: UUID,
  created: string,
  user: MemberObj,
  message: string
}


export type MessageRequest = {
  id: UUID,
  message: string
}

export type MemberObj = {
  id: UUID,
  chatName: string,
  pictureURL: string
}

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export type ChannelObj = {
  id: UUID,
  name: string
}
export type ControlResponse = {
  isSuccess: boolean,
  message: string | undefined
}
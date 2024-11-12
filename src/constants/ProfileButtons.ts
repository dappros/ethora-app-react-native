import { FC } from "react";
import { SvgProps } from "react-native-svg";

import {
  Bell,
  MuteBell,
  Search,
  Leave,
  Report,
  Block,
  Contact,
  Share,
  Message,
} from "@assets/icons";

export type ProfileButtonType = {
  id: string;
  name: string;
  nameMuted?: string;
  image: FC<SvgProps>;
  imageMute?: FC<SvgProps>;
};

export const chatButtons: ProfileButtonType[] = [
  { id: "muted", image: Bell, imageMute: MuteBell, name: "Muted", nameMuted: "Unmuted" },
  { id: "search", image: Search, name: "Search" },
  { id: "leave", image: Leave, name: "Leave" },
  { id: "report", image: Report, name: "Report" },
];

export const profileButtons: ProfileButtonType[] = [
  { id: "message", image: Message, name: "Message" },
  { id: "addContact", image: Contact, name: "Add contact" },
  { id: "share", image: Share, name: "Share" },
  { id: "block", image: Block, name: "Block" },
];

import { Favourites, Mute, Search, Report, Delete, Edit } from "@assets/icons/interactions";
import { FC } from "react";
import { SvgProps } from "react-native-svg";

export type OptionsType = {
  id: string;
  name: string;
  icon: FC<SvgProps>;
  color: string;
}

export const OptionsSettingProfile: OptionsType[] = [
  {
    id: "edit",
    name: "Edit",
    icon: Edit,
    color: "#000000",
  },
  {
    id: "mute",
    name: "Mute",
    icon: Mute,
    color: "#000000",
  },
  {
    id: "search",
    name: "Search",
    icon: Search,
    color: "#000000",
  },
  {
    id: "favourites",
    name: "Add to Favourites",
    icon: Favourites,
    color: "#000000",
  },
  {
    id: "report",
    name: "Report",
    icon: Report,
    color: "#9F0000",
  },
  {
    id: "delete",
    name: "Delete and Leave",
    icon: Delete,
    color: "#9F0000",
  },
];
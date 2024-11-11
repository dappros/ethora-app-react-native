import * as React from "react";
import { TextProps } from "react-native";

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.png' {
  import {ImageSourcePropType} from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}
declare module 'uuid';

export interface HighlighterProps extends TextProps {
  autoEscape?: boolean | undefined;
  highlightStyle?: TextProps["style"] | undefined;
  sanitize?: ((text: string) => string) | undefined;
  searchWords: string[];
  style?: TextProps["style"] | undefined;
  textToHighlight: string;
}

export default class Highlighter extends React.Component<HighlighterProps> {}
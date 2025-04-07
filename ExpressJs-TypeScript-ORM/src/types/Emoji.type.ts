import LogLevel from "./LogLevel.type";

type EmojiMap = {
  [key in LogLevel]: string;
};

export default EmojiMap;

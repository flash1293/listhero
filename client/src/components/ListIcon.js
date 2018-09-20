import React from "react";
import ActionList from "@material-ui/icons/List";
import emojiRegex from "emoji-regex";

const isEmoji = str => !!emojiRegex().exec(getWholeChar(str, 0));

function getWholeChar(str, i) {
  var code = str.charCodeAt(i);

  if (Number.isNaN(code)) {
    return ""; // Position not found
  }
  if (code < 0xd800 || code > 0xdfff) {
    return str.charAt(i);
  }

  if (0xd800 <= code && code <= 0xdbff) {
    return str.charAt(i) + str.charAt(i + 1);
  }

  return false;
}

export const filterLeadingEmoji = name =>
  isEmoji(name) ? name.replace(emojiRegex().exec(name), "") : name;

export default ({ name, style }) => (
  <span style={style}>
    {isEmoji(name) ? (
      <span style={{ fontSize: "1.4em" }}>{getWholeChar(name, 0)}</span>
    ) : (
      <ActionList />
    )}
  </span>
);

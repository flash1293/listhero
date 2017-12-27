import React from "react";
import ActionList from "material-ui-icons/List";

const isEmoji = str =>
  str.match(
    /^(\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]).*/
  );

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
  name.replace(
    /^(\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff])/,
    ""
  );

export default ({ name }) => (
  <span>
    {isEmoji(name) ? (
      <span style={{ fontSize: "1.5em" }}>{getWholeChar(name, 0)}</span>
    ) : (
      <ActionList />
    )}
  </span>
);

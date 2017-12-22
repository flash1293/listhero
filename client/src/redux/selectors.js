import find from "ramda/src/find";
import map from "ramda/src/map";
import compose from "ramda/src/compose";
import prop from "ramda/src/prop";
import defaultTo from "ramda/src/defaultTo";
import propEq from "ramda/src/propEq";

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

export default selectors => (state, ownProps) =>
  map(selector => selector(ownProps)(state), selectors);

export const lists = () =>
  compose(defaultTo(EMPTY_ARRAY), prop("present"), prop("lists"));

export const list = ownProps =>
  compose(find(propEq("uid", ownProps.listId)), lists());
export const listItems = ownProps => compose(prop("items"), list(ownProps));

export const user = () => compose(defaultTo(EMPTY_OBJECT), prop("user"));

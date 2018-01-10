import find from "ramda/src/find";
import filter from "ramda/src/filter";
import map from "ramda/src/map";
import compose from "ramda/src/compose";
import prop from "ramda/src/prop";
import defaultTo from "ramda/src/defaultTo";
import assoc from "ramda/src/assoc";
import propEq from "ramda/src/propEq";
import not from "ramda/src/not";

const mappedAssoc = (prop, mapFn) => obj => assoc(prop, mapFn(obj), obj);

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

export default selectors => (state, ownProps) =>
  map(selector => selector(ownProps)(state), selectors);

export const lists = () =>
  compose(
    map(addListItemCount),
    defaultTo(EMPTY_ARRAY),
    prop("present"),
    prop("lists")
  );

const addListItemCount = mappedAssoc(
  "itemCount",
  compose(
    prop("length"),
    filter(compose(not, prop("marker"))),
    defaultTo(EMPTY_ARRAY),
    prop("items")
  )
);

export const list = ownProps =>
  compose(find(propEq("uid", ownProps.listId)), lists());
export const listItems = ownProps => compose(prop("items"), list(ownProps));

export const user = () => compose(defaultTo(EMPTY_OBJECT), prop("user"));

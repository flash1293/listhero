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

export const lists = () => state =>
  compose(
    map(addEnteredText(state.enteredText)),
    map(addPreferredView(state.preferredView)),
    map(addListItemCount),
    defaultTo(EMPTY_ARRAY),
    prop("present"),
    prop("lists")
  )(state);

const addPreferredView = preferredView => list => ({
  ...list,
  preferredView: preferredView[list.uid]
});

const addEnteredText = enteredText => list => ({
  ...list,
  enteredText: enteredText[list.uid]
});

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

export const preferredView = () => prop("preferredView");

export const filteredItems = ownProps =>
  compose(
    map(item => ({
      ...item,
      isDivider: /^-{4,}$/.test(item.name)
    })),
    items =>
      items.filter(
        (item, index, items) =>
          !(
            item.marker &&
            (index === items.length - 1 || items[index + 1].marker)
          )
      ),
    defaultTo(EMPTY_ARRAY),
    prop("items"),
    find(propEq("uid", ownProps.listId)),
    lists()
  );

export const merged = () => compose(prop("merged"), prop("lists"));

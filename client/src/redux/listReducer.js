import uniq from "ramda/src/uniq";
import flatten from "ramda/src/flatten";
import zip from "ramda/src/zip";

import { arrayMove } from "./utils";

import {
  stackItemIndex,
  increaseStack,
  isStacked,
  decreaseStack
} from "./stackItemHelpers";

// TODO: lists-wrapper hier rausnehmen
const initalState = [];

const RECENT_ITEMS_LENGTH = 200;

const weekplanItems = [
  "weekday_0",
  "weekday_1",
  "weekday_2",
  "weekday_3",
  "weekday_4",
  "weekday_5",
  "weekday_6",
  "weekday_other"
].map(label => ({
  label,
  marker: true
}));

function replaceByMap(list, pred, map) {
  const newList = [...list];
  const index = list.findIndex(pred);
  if (index > -1) newList[index] = map(newList[index]);
  return newList;
}

export default function reducer(state = initalState, action) {
  switch (action.type) {
    case "ADD_LIST":
      if (action.name === "") return state;
      return [
        { name: action.name, uid: action.uid, items: [], recentItems: [] },
        ...state
      ];
    case "ADD_ITEM":
      if (!action.name) return state;
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          items:
            action.stackIfPossible &&
            stackItemIndex(list.items, action.name) >= 0
              ? (() => {
                  // TODO move this to individual functions
                  const itemToStack = stackItemIndex(list.items, action.name);
                  return list.items.map(
                    (item, index) =>
                      index === itemToStack
                        ? {
                            ...item,
                            name: increaseStack(item.name),
                            stacked: true
                          }
                        : item
                  );
                })()
              : [
                  {
                    name: action.name,
                    uid: action.uid,
                    stacked: isStacked(action.name)
                  },
                  ...list.items
                ],
          recentItems: list.recentItems.filter(i => i !== action.name)
        })
      );
    case "INCREASE_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          items: replaceByMap(
            list.items,
            i => i.uid === action.item,
            item => ({
              ...item,
              name: increaseStack(item.name),
              stacked: true
            })
          )
        })
      );
    case "DECREASE_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          items: replaceByMap(
            list.items,
            i => i.uid === action.item,
            item => ({
              ...item,
              name: decreaseStack(item.name),
              stacked: isStacked(decreaseStack(item.name))
            })
          )
        })
      );
    case "MOVE_LIST":
      const oldIndex = state.findIndex(i => i.uid === action.oldId);
      const newIndex =
        action.newIndex !== undefined
          ? action.newIndex
          : state.findIndex(i => i.uid === action.newId);
      return oldIndex === -1
        ? state
        : arrayMove(state, oldIndex, Math.min(newIndex, state.length - 1));
    case "MOVE_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => {
          const oldIndex = list.items.findIndex(i => i.uid === action.oldId);
          const newIndex =
            action.newIndex !== undefined
              ? action.newIndex
              : list.items.findIndex(i => i.uid === action.newId);
          return oldIndex === -1 || (list.isWeekplan && newIndex === 0)
            ? list
            : {
                ...list,
                items: arrayMove(
                  list.items,
                  oldIndex,
                  Math.min(newIndex, list.items.length - 1)
                )
              };
        }
      );
    case "MOVE_ITEM_TO_BOTTOM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => {
          const oldIndex = list.items.findIndex(i => i.uid === action.item);
          const newIndex = list.items.length - 1;
          return oldIndex === -1
            ? list
            : {
                ...list,
                items: arrayMove(list.items, oldIndex, newIndex)
              };
        }
      );
    case "REMOVE_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => {
          const item = list.items.find(i => i.uid === action.item);
          if (item) {
            return {
              ...list,
              items: list.items.filter(i => i !== item),
              recentItems: [
                item.name,
                ...list.recentItems.filter(i => i !== item.name)
              ].slice(0, RECENT_ITEMS_LENGTH)
            };
          } else {
            return list;
          }
        }
      );
    case "REMOVE_RECENTLY_USED_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          recentItems: list.recentItems.filter(i => i !== action.item)
        })
      );
    case "CLEAR_LIST":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => {
          return {
            ...list,
            items: list.items.filter(item => item.marker),
            recentItems: uniq(
              list.items
                .filter(item => !item.marker)
                .map(item => item.name)
                .concat(list.recentItems)
            ).slice(0, RECENT_ITEMS_LENGTH)
          };
        }
      );
    case "EDIT_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          items: replaceByMap(
            list.items,
            i => i.uid === action.item,
            item => ({
              ...item,
              name: action.name,
              stacked: isStacked(action.name)
            })
          )
        })
      );
    case "EDIT_LIST":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          name: action.name
        })
      );
    case "CREATE_WEEKPLAN":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          isWeekplan: true,
          items: flatten(zip(weekplanItems, list.items)).concat(
            list.items.length > 8
              ? list.items.slice(8)
              : weekplanItems.slice(list.items.length)
          )
        })
      );
    case "CREATE_NORMAL_LIST":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          isWeekplan: false,
          items: list.items.filter(item => !item.marker)
        })
      );
    case "REMOVE_LIST":
      return state.filter(l => l.uid !== action.list);
    default:
      return state;
  }
}

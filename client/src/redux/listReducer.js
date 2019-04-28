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
const initalState = { currentLists: [], log: [] };

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

export function currentListsReducer(state, action) {
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
                  return list.items.map((item, index) =>
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
    case "MOVE_ITEM_TO_LIST":
      const oldList = state.find(list => list.uid === action.oldList);
      if (!oldList) {
        return state;
      }
      const itemToMove = oldList.items.find(item => item.uid === action.oldId);
      if (!itemToMove) {
        return state;
      }
      return state.map(list => {
        if (list.uid === action.oldList) {
          return {
            ...list,
            items: list.items.filter(item => item !== itemToMove)
          };
        } else if (list.uid === action.newList) {
          return {
            ...list,
            items: [itemToMove, ...list.items]
          };
        } else return list;
      });
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
    case "REMOVE_MULTIPLE_ITEMS":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => {
          const itemsToDelete = list.items
            .filter(item => action.items.indexOf(item.uid) > -1)
            .filter(item => !item.marker);
          if (itemsToDelete) {
            return {
              ...list,
              items: list.items.filter(i => action.items.indexOf(i.uid) === -1),
              recentItems: uniq(
                itemsToDelete.map(item => item.name).concat(list.recentItems)
              ).slice(0, RECENT_ITEMS_LENGTH)
            };
          } else {
            return list;
          }
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

function decorateLogItem(logItem, action) {
  return {
    type: action.type,
    timestamp: action.timestamp,
    listId: action.list,
    ...logItem
  };
}

function getLogItemForAction(action, lists) {
  let list, item, itemMap, oldList, newList;
  switch (action.type) {
    case "ADD_LIST":
      return decorateLogItem({ list: action.name, listId: action.uid }, action);
    case "ADD_ITEM":
      list = lists.find(({ uid }) => uid === action.list);
      if (!list) return;
      return decorateLogItem({
        list: list.name,
        item: action.name
      }, action);
    case "REMOVE_ITEM":
      list = lists.find(({ uid }) => uid === action.list);
      if (!list) return;
      item = list.items.find(({ uid }) => uid === action.item);
      if (!item) return;
      return decorateLogItem({ list: list.name, item: item.name }, action);
    case "REMOVE_RECENTLY_USED_ITEM":
      list = lists.find(({ uid }) => uid === action.list);
      if (!list) return;
      return decorateLogItem({ list: list.name, item: action.item }, action);
    case "CLEAR_LIST":
      list = lists.find(({ uid }) => uid === action.list);
      if (!list) return;
      return list.items.map(({ name }) => ({
        type: "REMOVE_ITEM",
        list: list.name,
        item: name
      }));
    case "REMOVE_MULTIPLE_ITEMS":
      list = lists.find(({ uid }) => uid === action.list);
      if (!list) return;
      itemMap = list.items.reduce(
        (map, item) => ({ ...map, [item.uid]: item }),
        {}
      );
      return action.items.map(uid => ({
        type: "REMOVE_ITEM",
        timestamp: action.timestamp,
        list: list.name,
        item: itemMap[uid]
      }));
    case "EDIT_ITEM":
      list = lists.find(({ uid }) => uid === action.list);
      if (!list) return;
      item = list.items.find(({ uid }) => uid === action.item);
      if (!item) return;
      return decorateLogItem({
        list: list.name,
        oldItem: item.name,
        item: action.name
      }, action);
    case "EDIT_LIST":
      list = lists.find(({ uid }) => uid === action.list);
      if (!list) return;
      return decorateLogItem({ oldList: list.name, list: action.name }, action);
    case "REMOVE_LIST":
      list = lists.find(({ uid }) => uid === action.list);
      if (!list) return;
      return decorateLogItem({ list: list.name }, action);
    case "MOVE_ITEM_TO_LIST":
      oldList = lists.find(({ uid }) => uid === action.oldList);
      if (!oldList) return;
      newList = lists.find(({ uid }) => uid === action.newList);
      if (!newList) return;
      item = oldList.items.find(({ uid }) => uid === action.oldId);
      if (!item) return;
      return decorateLogItem({
        oldList: oldList.name,
        list: newList.name,
        item: item.name,
        listId: action.newList,
        oldListId: action.oldList
      }, action);
    default:
      return undefined;
  }
}

export default function loggingReducer(state = initalState, action) {
  const updatedLists = currentListsReducer(state.currentLists, action);
  if (updatedLists === state.currentLists) {
    return state;
  } else {
    const logItem = getLogItemForAction(action, state.currentLists);
    return {
      ...state,
      currentLists: updatedLists,
      log: logItem
        ? [...state.log, ...(logItem instanceof Array ? logItem : [logItem])]
        : state.log
    };
  }
}

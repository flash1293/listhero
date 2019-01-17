import map from "ramda/src/map";
import uuid from "uuid/v4";
import aes from "aes-js";
import { getRandomData, uint8ArrayToArray } from "./utils";

export default handlerMakers => (dispatch, ownProps) =>
  map(handler => handler(dispatch, ownProps), handlerMakers);

export const addItem = (dispatch, ownProps) => name =>
  dispatch({
    type: "ADD_ITEM",
    list: ownProps.listId,
    uid: uuid(),
    name
  });

export const editItem = (dispatch, ownProps) => (item, name) =>
  dispatch({
    type: "EDIT_ITEM",
    list: ownProps.listId,
    item: item.uid,
    name
  });

export const moveItem = (dispatch, ownProps) => (oldId, newIndex) =>
  dispatch({
    type: "MOVE_ITEM",
    list: ownProps.listId,
    oldId,
    newIndex
  });

export const moveItemToList = (dispatch, ownProps) => (oldId, newList) =>
  dispatch({
    type: "MOVE_ITEM_TO_LIST",
    oldList: ownProps.listId,
    newList,
    oldId,
    // example on how to use compat_levels to prevent a full re-sync in most cases
    // if MOVE_ITEM_TO_LIST is a new action and there may be client which don't support
    // it yet simultaneously with clients which already dispatch this type of action.
    // if the old clients never encounter the new action type, there is no reason
    // to completely re-sync by bumping the reducer version. But if they do, they have to
    // re-reduce the action. If the compat level prop here is bigger than the compatVersion of the
    // higher order reducer, the middleware will enter compat mode and wait for an update of compatVersion.
    // As soon as it arrives, it will do the re-sync. The other clients which were up-to-date in time
    // don't see anything about this
    // "@@sync/compat_level/list": 1
  });

export const changeEnteredText = (dispatch, ownProps) => text =>
  dispatch({
    type: "CHANGE_ENTERED_TEXT",
    list: ownProps.listId,
    text
  });

export const moveItemToBottom = (dispatch, ownProps) => item =>
  dispatch({
    type: "MOVE_ITEM_TO_BOTTOM",
    list: ownProps.listId,
    item: item.uid
  });

export const removeItem = (dispatch, ownProps) => item =>
  dispatch({
    type: "REMOVE_ITEM",
    list: ownProps.listId,
    item: item.uid
  });

export const removeRecentlyUsedItem = (dispatch, ownProps) => item =>
  dispatch({
    type: "REMOVE_RECENTLY_USED_ITEM",
    list: ownProps.listId,
    item: item
  });

export const increaseItem = (dispatch, ownProps) => item =>
  dispatch({
    type: "INCREASE_ITEM",
    list: ownProps.listId,
    item: item.uid
  });

export const decreaseItem = (dispatch, ownProps) => item =>
  dispatch({
    type: "DECREASE_ITEM",
    list: ownProps.listId,
    item: item.uid
  });

export const addStackableItem = (dispatch, ownProps) => name =>
  dispatch({
    type: "ADD_ITEM",
    list: ownProps.listId,
    uid: uuid(),
    stackIfPossible: true,
    name
  });

export const addList = dispatch => name =>
  dispatch({
    type: "ADD_LIST",
    uid: uuid(),
    name
  });

export const visitList = dispatch => uid =>
  dispatch({
    type: "VISIT_LIST",
    uid
  });

export const createWeekplan = dispatch => list =>
  dispatch({
    type: "CREATE_WEEKPLAN",
    list: list.uid
  });

export const setPreferredView = dispatch => (list, view) =>
  dispatch({
    type: "PREFERRED_VIEW",
    list: list.uid,
    view
  });

export const createNormalList = dispatch => list =>
  dispatch({
    type: "CREATE_NORMAL_LIST",
    list: list.uid
  });

export const moveList = dispatch => (oldId, newIndex) =>
  dispatch({
    type: "MOVE_LIST",
    oldId,
    newIndex
  });

export const editList = dispatch => (list, name) =>
  dispatch({
    type: "EDIT_LIST",
    list: list.uid,
    name
  });

export const removeList = dispatch => list =>
  dispatch({
    type: "REMOVE_LIST",
    list: list.uid
  });

export const clearList = dispatch => list =>
  dispatch({
    type: "REMOVE_MULTIPLE_ITEMS",
    list: list.uid,
    items: list.items.map(item => item.uid)
  });

export const requestLogin = dispatch => (
  username,
  password,
  encryptionKey,
  serverPassword
) => {
  return dispatch({
    type: "LOGIN",
    username,
    password,
    encryptionKey,
    serverPassword
  });
};

export const createLogin = dispatch => serverPassword =>
  dispatch({
    type: "LOGIN",
    username: uuid(),
    password: aes.utils.hex.fromBytes(getRandomData(256)),
    encryptionKey: uint8ArrayToArray(getRandomData(256)),
    serverPassword
  });

export const refresh = dispatch => () =>
  dispatch({
    type: "@@sync/REQUEST_SYNC",
    key: "lists"
  });

export const logout = dispatch => () =>
  dispatch({
    type: "LOGOUT"
  });

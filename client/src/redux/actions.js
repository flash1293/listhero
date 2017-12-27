import map from "ramda/src/map";
import uuid from "uuid/v4";

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
    type: "CLEAR_LIST",
    list: list.uid
  });

export const requestLogin = dispatch => password => {
  dispatch({
    type: "LOGIN",
    password
  });
  dispatch({
    type: "@@sync/REQUEST_SYNC",
    key: "lists",
    skipRetry: true
  });
};

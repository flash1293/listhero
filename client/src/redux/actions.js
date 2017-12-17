import map from "ramda/src/map";
import uuid from "uuid/v4";

export default handlerMakers => (dispatch, ownProps) =>
  map(handler => handler(dispatch, ownProps), handlerMakers);

export const addItem = (dispatch, ownProps) => name =>
  dispatch({
    type: "ADD_ITEM",
    list: ownProps.match.params.id,
    uid: uuid(),
    name
  });

export const removeDoneItems = (dispatch, ownProps) => () =>
  dispatch({
    type: "REMOVE_DONE",
    list: ownProps.match.params.id
  });

export const editItem = (dispatch, ownProps) => (item, name) =>
  dispatch({
    type: "EDIT_ITEM",
    list: ownProps.match.params.id,
    item,
    name
  });

export const moveItem = (dispatch, ownProps) => (oldId, newId) =>
  dispatch({
    type: "MOVE_ITEM",
    list: ownProps.match.params.id,
    oldId,
    newId
  });

export const toggleItem = (dispatch, ownProps) => index =>
  dispatch({
    type: "TOGGLE_ITEM",
    list: ownProps.match.params.id,
    item: index
  });

export const addStackableItem = (dispatch, ownProps) => name =>
  dispatch({
    type: "ADD_ITEM",
    list: ownProps.match.params.id,
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

export const moveList = dispatch => (oldId, newId) =>
  dispatch({
    type: "MOVE_LIST",
    oldId,
    newId
  });

export const editList = dispatch => (list, name) =>
  dispatch({
    type: "EDIT_LIST",
    list,
    name
  });

export const removeList = dispatch => list =>
  dispatch({
    type: "REMOVE_LIST",
    list
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

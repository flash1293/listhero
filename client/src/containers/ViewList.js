import React from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import List, { ListItem, ListItemText } from "material-ui/List";
import IconButton from "material-ui/IconButton";
import Edit from "material-ui-icons/Edit";
import ArrowBack from "material-ui-icons/ArrowBack";
import { connect } from "react-redux";
import { compose } from "redux";
import ClickNHold from "react-click-n-hold";
import { withHandlers } from "recompose";

import editDialog from "../components/EditDialog";
import ContextDialog from "../components/ContextDialog";
import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import AddItemNavigation from "../components/AddItemNavigation";
import removeAnimation from "../components/RemoveAnimation";
import routeParam from "../components/RouteParam";
import buildHandlers, { removeItem, moveItemToBottom } from "../redux/actions";
import buildSelector, { list } from "../redux/selectors";

const ViewListItem = compose(
  withHandlers({
    handleRemove: ownProps => () => ownProps.removeItem(ownProps.item),
    handleContextMenu: ownProps => () =>
      ownProps.handleContextMenu(ownProps.item)
  }),
  removeAnimation("handleRemove")
)(({ item, onRemoveDelayed, hideClassName, handleContextMenu }) => (
  <ClickNHold time={2} onClickNHold={handleContextMenu}>
    <ListItem button onClick={onRemoveDelayed}>
      <ListItemText primary={item.name} className={hideClassName} />
    </ListItem>
  </ClickNHold>
));

const ItemContextDialog = withHandlers({
  handleRemove: ownProps => () => {
    ownProps.removeItem(ownProps.item);
    ownProps.onClose();
  },
  handleSendToBottom: ownProps => () => {
    ownProps.moveToBottom(ownProps.item);
    ownProps.onClose();
  }
})(({ item, handleSendToBottom, handleRemove, onClose }) => (
  <ContextDialog onClose={onClose}>
    <ListItem button onClick={handleSendToBottom}>
      <ListItemText primary="Nach unten verschieben" />
    </ListItem>
    <ListItem button onClick={handleRemove}>
      <ListItemText primary="Abhaken" />
    </ListItem>
  </ContextDialog>
));

export const ViewList = ({
  list: { name, items },
  listId,
  removeItem,
  moveItemToBottom,
  dialogItem,
  handleDialogOpen,
  handleDialogClose
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Link to="/">
          <IconButton color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography type="title" color="inherit" style={{ flex: 1 }}>
          {name}
        </Typography>
        <Link to={`/lists/${listId}/edit`}>
          <IconButton aria-label="Editieren" color="inherit">
            <Edit />
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
    <List>
      {items.map((item, index) => (
        <ViewListItem
          item={item}
          key={item.uid}
          removeItem={removeItem}
          handleContextMenu={handleDialogOpen}
        />
      ))}
    </List>
    <AddItemNavigation uid={listId} />
    {dialogItem && (
      <ItemContextDialog
        item={dialogItem}
        onClose={handleDialogClose}
        removeItem={removeItem}
        moveToBottom={moveItemToBottom}
      />
    )}
  </div>
);

export default compose(
  redirectToLogin,
  routeParam("id", "listId"),
  connect(
    buildSelector({ list }),
    buildHandlers({
      removeItem,
      moveItemToBottom
    })
  ),
  editDialog("Item"),
  redirectToHome
)(ViewList);

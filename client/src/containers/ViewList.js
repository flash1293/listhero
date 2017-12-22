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
import routeParam from "../components/RouteParam";
import buildHandlers, { toggleItem, moveItemToBottom } from "../redux/actions";
import buildSelector, { list, activeItems } from "../redux/selectors";

const ViewListItem = withHandlers({
  handleToggle: ownProps => () => ownProps.toggleItem(ownProps.item),
  handleContextMenu: ownProps => () => ownProps.handleContextMenu(ownProps.item)
})(({ item, handleToggle, handleContextMenu }) => (
  <ClickNHold time={2} onClickNHold={handleContextMenu}>
    <ListItem button onClick={handleToggle}>
      <ListItemText primary={item.name} />
    </ListItem>
  </ClickNHold>
));

const ItemContextDialog = withHandlers({
  handleToggle: ownProps => () => {
    ownProps.toggleItem(ownProps.item);
    ownProps.onClose();
  },
  handleSendToBottom: ownProps => () => {
    ownProps.moveToBottom(ownProps.item);
    ownProps.onClose();
  }
})(({ item, handleSendToBottom, handleToggle, onClose }) => (
  <ContextDialog onClose={onClose}>
    <ListItem button onClick={handleSendToBottom}>
      <ListItemText primary="Nach unten verschieben" />
    </ListItem>
    <ListItem button onClick={handleToggle}>
      <ListItemText primary="Abhaken" />
    </ListItem>
  </ContextDialog>
));

export const ViewList = ({
  list: { name },
  activeItems,
  listId,
  toggleItem,
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
      {activeItems.map((item, index) => (
        <ViewListItem
          item={item}
          key={item.uid}
          toggleItem={toggleItem}
          handleContextMenu={handleDialogOpen}
        />
      ))}
    </List>
    {dialogItem && (
      <ItemContextDialog
        item={dialogItem}
        onClose={handleDialogClose}
        toggleItem={toggleItem}
        moveToBottom={moveItemToBottom}
      />
    )}
  </div>
);

export default compose(
  redirectToLogin,
  routeParam("id", "listId"),
  connect(
    buildSelector({ list, activeItems }),
    buildHandlers({
      toggleItem,
      moveItemToBottom
    })
  ),
  editDialog("Item"),
  redirectToHome
)(ViewList);

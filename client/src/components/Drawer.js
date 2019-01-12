import React from "react";
import compose from "ramda/src/compose";
import Drawer from "@material-ui/core/Drawer";
import LinkIcon from "@material-ui/icons/Link";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { connect } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import SyncIcon from "@material-ui/icons/Sync";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import ShareIcon from "@material-ui/icons/Share";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Divider from "@material-ui/core/Divider/Divider";
import { Link } from "react-router-dom";

import { REDUCER_VERSION } from "../config";
import buildSelector, { user } from "../redux/selectors";
import buildHandlers, { refresh, logout } from "../redux/actions";
import syncLink from "../components/SyncLink";
import addDialog from "../components/AddDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { Logo } from "../components/Logo";

export default compose(
  connect(
    buildSelector({
      user
    }),
    buildHandlers({
      refresh,
      logout
    })
  ),
  syncLink,
  addDialog("logout"))(
  ({
    isDrawerOpen,
    toggleDrawer,
    user: { username },
    isDialogOpen,
    handleDialogOpen,
    handleDialogClose,
    handleDialogSubmit,
    syncLink,
    refresh
  }) => (
    <React.Fragment>
      <Drawer open={isDrawerOpen} type="temporary" onClose={toggleDrawer}>
        <div role="button">
          <List>
            <ListItem>
              <ListItemIcon>
                <Logo />
              </ListItemIcon>
              <ListItemText
                primary={`Listhero Version ${REDUCER_VERSION}`}
                secondary={`Account-ID: ${username}`}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeft />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <CopyToClipboard text={syncLink}>
              <ListItem button>
                <ListItemIcon>
                  <LinkIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Sync-Link kopieren"
                  secondary="Dieser Link gibt Zugriff auf deinen Account"
                />
              </ListItem>
            </CopyToClipboard>
            <Link to="/qr">
              <ListItem button>
                <ListItemIcon>
                  <ShareIcon />
                </ListItemIcon>
                <ListItemText primary="Sync-Link als Qr Code anzeigen" />
              </ListItem>
            </Link>
            <Link to="/readQr">
              <ListItem button>
                <ListItemIcon>
                  <PhotoCameraIcon />
                </ListItemIcon>
                <ListItemText primary="Sync-Qr-Code abscannen" />
              </ListItem>
            </Link>
            <ListItem button onClick={refresh}>
              <ListItemIcon>
                <SyncIcon />
              </ListItemIcon>
              <ListItemText primary="Neu synchronisieren" />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleDialogOpen}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Neuen Account erstellen"
                secondary="Ohne Sync-Link geht dein aktueller Account verloren"
              />
            </ListItem>
            <Divider />
            <Link to="/help">
              <ListItem button>
                <ListItemIcon>
                  <KeyboardIcon />
                </ListItemIcon>
                <ListItemText primary="Shortcuts" />
              </ListItem>
            </Link>
          </List>
        </div>
      </Drawer>
      {isDialogOpen && (
        <ConfirmDialog
          label="Willst du deinen aktuellen Account wirklich verwerfen?"
          onSubmit={handleDialogSubmit}
          onClose={handleDialogClose}
        />
      )}
    </React.Fragment>
  )
);
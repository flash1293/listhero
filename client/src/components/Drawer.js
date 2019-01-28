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
import { I18n } from "react-i18next";

import { REDUCER_VERSION } from "../config";
import buildSelector, { user } from "../redux/selectors";
import buildHandlers, { refresh, logout } from "../redux/actions";
import syncLink from "../components/SyncLink";
import addDialog from "../components/AddDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { Logo } from "../components/Logo";
import { Typography } from "@material-ui/core";

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
  addDialog("logout")
)(
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
    <I18n>
      {t => (
        <React.Fragment>
          <Drawer open={isDrawerOpen} type="temporary" onClose={toggleDrawer}>
            <div role="button">
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Logo inline />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${t("drawer_version")} ${REDUCER_VERSION}`}
                    secondary={`${t("drawer_accountid")}: ${username}`}
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
                      primary={t("drawer_copysync")}
                      secondary={t("drawer_copysync_description")}
                    />
                  </ListItem>
                </CopyToClipboard>
                <Link to="/qr">
                  <ListItem button>
                    <ListItemIcon>
                      <ShareIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("drawer_copysyncqr")} />
                  </ListItem>
                </Link>
                <Link to="/readQr">
                  <ListItem button>
                    <ListItemIcon>
                      <PhotoCameraIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("drawer_scanqr")} />
                  </ListItem>
                </Link>
                <ListItem button onClick={refresh}>
                  <ListItemIcon>
                    <SyncIcon />
                  </ListItemIcon>
                  <ListItemText primary={t("drawer_resync")} />
                </ListItem>
                <Divider />
                <ListItem button onClick={handleDialogOpen}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("drawer_newaccount")}
                    secondary={t("drawer_newaccount_description")}
                  />
                </ListItem>
                <Divider />
                <Link to="/help">
                  <ListItem button>
                    <ListItemIcon>
                      <KeyboardIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("drawer_shortcuts")} />
                  </ListItem>
                </Link>
              </List>
              <Typography><a href="/__licenses.txt" download style={{ position: "absolute", bottom: 10, left: 18, color: '#999' }}>License</a></Typography>
            </div>
          </Drawer>
          {isDialogOpen && (
            <ConfirmDialog
              label={t("drawer_newaccount_dialog")}
              onSubmit={handleDialogSubmit}
              onClose={handleDialogClose}
            />
          )}
        </React.Fragment>
      )}
    </I18n>
  )
);

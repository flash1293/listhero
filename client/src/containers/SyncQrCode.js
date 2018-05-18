import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { compose } from "redux";
import QRCode from "qrcode.react";

import redirectToLogin from "../components/RedirectToLogin";
import routerContext from "../components/RouterContext";
import syncLink from "../components/SyncLink";

export const SyncQrCode = ({ syncLink, router }) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton onClick={router.history.goBack} color="inherit">
          <ArrowBack />
        </IconButton>
        <Typography type="title" color="inherit">
          Sync-Link
        </Typography>
      </Toolbar>
    </AppBar>
    <div
      style={{
        display: "block",
        textAlign: "center",
        margin: "5vmin auto"
      }}
    >
      <QRCode size={300} value={syncLink} />
    </div>
    <Typography style={{ padding: 15, textAlign: "center" }}>
      Dieser QR-Code gibt Zugriff auf deinen Account.
    </Typography>
  </div>
);

export default compose(redirectToLogin, routerContext, syncLink)(SyncQrCode);

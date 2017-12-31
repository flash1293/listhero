import React from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import List from "material-ui/List";
import IconButton from "material-ui/IconButton";
import ArrowBack from "material-ui-icons/ArrowBack";
import { connect } from "react-redux";
import { compose } from "redux";
import QRCode from "qrcode.react";

import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import routeParam from "../components/RouteParam";
import routerContext from "../components/RouterContext";
import syncLink from "../components/SyncLink";
import buildSelector, { list } from "../redux/selectors";
import AddableItem from "../components/AddableItem";

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

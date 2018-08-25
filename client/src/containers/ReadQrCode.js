import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { compose } from "redux";
import QrReader from "react-qr-reader";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Send from "@material-ui/icons/Send";
import { withHandlers } from "recompose";

import redirectToLogin from "../components/RedirectToLogin";
import routerContext from "../components/RouterContext";
import syncLink from "../components/SyncLink";
import inputForm from "../components/InputForm";

export const SyncQrCode = ({
  router,
  handleChangeText,
  handleSubmit,
  onSubmit,
  text
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton onClick={router.history.goBack} color="inherit">
          <ArrowBack />
        </IconButton>
        <Typography variant="title" color="inherit">
          Sync-Link einlesen
        </Typography>
      </Toolbar>
    </AppBar>
    <form
      style={{
        display: "block",
        textAlign: "center",
        margin: "5vmin auto",
        maxWidth: "400px"
      }}
      onSubmit={handleSubmit}
    >
      <Typography style={{ padding: 15 }}>
        Scanne einen Sync-Qr-Code:
      </Typography>
      <QrReader
        delay={300}
        onScan={onSubmit}
        onError={() => {}}
        style={{ width: "100%" }}
      />
      <Typography style={{ padding: 15 }}>
        oder füge hier einen Link ein:
      </Typography>
      <Input
        type="text"
        placeholder={`${window.location.protocol}//${window.location.host}/...`}
        value={text}
        onChange={handleChangeText}
        endAdornment={
          <InputAdornment position="end">
            <IconButton tabIndex={-1} onClick={handleSubmit}>
              <Send />
            </IconButton>
          </InputAdornment>
        }
      />
    </form>
  </div>
);

export default compose(
  redirectToLogin,
  routerContext,
  syncLink,
  withHandlers({
    onSubmit: ({ router }) => shareUrl =>
      shareUrl && router.history.push(new URL(shareUrl).hash.substr(1))
  }),
  inputForm
)(SyncQrCode);

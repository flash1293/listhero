import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Redirect } from "react-router";
import { branch, lifecycle, withHandlers } from "recompose";
import { compose } from "redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import LinkIcon from "@material-ui/icons/Link";
import ErrorIcon from "@material-ui/icons/Error";
import SyncIcon from "@material-ui/icons/Sync";
import aes from "aes-js";
import { I18n } from "react-i18next";

import buildHandlers, { requestLogin, createLogin } from "../redux/actions";
import buildSelector, { user } from "../redux/selectors";
import syncLink from "../components/SyncLink";
import ServerPassword from "../components/ServerPassword";

const Login = ({
  loginWithLinkData,
  submitServerPassword,
  syncLink,
  user: { requesting, username, serverPassword, failed },
  match: {
    params: { username: linkDataUsername }
  }
}) => (
  <I18n>
    {t => (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              {t("login_title")}
            </Typography>
          </Toolbar>
        </AppBar>
        {!requesting && serverPassword && failed && (
          <Typography
            style={{
              margin: "20px auto",
              maxWidth: 400,
              display: "flex",
              alignItems: "center"
            }}
          >
            <ErrorIcon style={{ paddingRight: 15 }} />
            <span>
              {t("login_error")} {!linkDataUsername && t("login_servererror")}
            </span>
          </Typography>
        )}
        {!requesting && !linkDataUsername && (
          <ServerPassword
            initialText={serverPassword}
            onSubmit={submitServerPassword}
            buttonLabel={username ? t("login_login") : t("login_createaccount")}
          />
        )}
        {linkDataUsername && !failed && !requesting && (
          <div style={{ padding: 20 }}>
            <Typography>{t("login_overwritewarning")}</Typography>
            <Button onClick={loginWithLinkData}>
              <SyncIcon style={{ marginRight: 10 }} />
              {t("login_overwrite")}
            </Button>

            <CopyToClipboard text={syncLink}>
              <Button>
                <LinkIcon style={{ marginRight: 10 }} />
                {t("login_copysynclink")}
              </Button>
            </CopyToClipboard>
          </div>
        )}
        {requesting && (
          <CircularProgress
            style={{
              margin: "0 auto",
              display: "block",
              marginTop: 50
            }}
            size={80}
            thickness={4}
          />
        )}
      </div>
    )}
  </I18n>
);

export default compose(
  connect(
    buildSelector({ user }),
    buildHandlers({
      requestLogin,
      createLogin
    })
  ),
  branch(
    props =>
      props.user.loggedIn &&
      (props.match.params.username === undefined ||
        props.match.params.username === props.user.username),
    () => () => <Redirect to="/" />
  ),
  withHandlers({
    loginWithLinkData: ({
      requestLogin,
      match: {
        params: { username, password, encryptionKey, serverPassword }
      }
    }) => () =>
      requestLogin(
        username,
        password,
        aes.utils.hex.toBytes(encryptionKey),
        serverPassword
      ),
    submitServerPassword: ({
      createLogin,
      requestLogin,
      user
    }) => serverPassword => {
      if (user.username) {
        requestLogin(
          user.username,
          user.password,
          user.encryptionKey,
          serverPassword
        );
      } else {
        createLogin(serverPassword);
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      const {
        user,
        requestLogin,
        createLogin,
        loginWithLinkData,
        match: {
          params: { username: linkDataUsername }
        }
      } = this.props;
      if (
        linkDataUsername &&
        (!user.username || user.username === linkDataUsername)
      ) {
        loginWithLinkData();
      } else if (user.username && !linkDataUsername) {
        requestLogin(
          user.username,
          user.password,
          user.encryptionKey,
          user.serverPassword
        );
      } else if (!linkDataUsername) {
        createLogin();
      }
    }
  }),
  syncLink
)(Login);

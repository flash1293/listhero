import React from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import { connect } from "react-redux";
import { CircularProgress } from "material-ui/Progress";
import { Redirect } from "react-router";
import { branch, lifecycle, withHandlers } from "recompose";
import { compose } from "redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import LinkIcon from "material-ui-icons/Link";
import SyncIcon from "material-ui-icons/Sync";

import buildHandlers, { requestLogin, createLogin } from "../redux/actions";
import buildSelector, { user } from "../redux/selectors";
import syncLink from "../components/SyncLink";

const Login = ({
  loginWithLinkData,
  syncLink,
  user: { requesting, username },
  match: { params: { username: linkDataUsername } }
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography type="title" color="inherit">
          Konto-Synchronisierung
        </Typography>
      </Toolbar>
    </AppBar>
    {/* TODO make pretty */}
    {linkDataUsername &&
      !requesting && (
        <div style={{ padding: 20 }}>
          <Typography>
            Achtung, dein aktuelles Nutzerkonto wird bei der Synchronisierung
            überschrieben. Wenn du dein Konto nicht verlieren willst, sichere
            dir zuerst den Synchronisierungs-Link.
          </Typography>
          <Button onClick={loginWithLinkData}>
            <SyncIcon style={{ marginRight: 10 }} />
            Synchronisieren
          </Button>

          <CopyToClipboard text={syncLink}>
            <Button>
              <LinkIcon style={{ marginRight: 10 }} />
              Sync-Link für aktuelles Konto kopieren
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
      match: { params: { username, password } }
    }) => () => requestLogin(username, password)
  }),
  lifecycle({
    componentDidMount() {
      const {
        user,
        requestLogin,
        createLogin,
        match: {
          params: { username: linkDataUsername, password: linkDataPassword }
        }
      } = this.props;
      if (linkDataUsername && !user.username) {
        requestLogin(linkDataUsername, linkDataPassword);
      } else if (user.username && !linkDataUsername) {
        requestLogin(user.username, user.password);
      } else if (!linkDataUsername) {
        createLogin();
      }
    }
  }),
  syncLink
)(Login);

import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { connect } from "react-redux";
import { compose } from "redux";
import { I18n } from "react-i18next";
import routerContext from "../components/RouterContext";
import { InView } from "react-intersection-observer";
import { withHandlers, withState, lifecycle } from "recompose";

import redirectToLogin from "../components/RedirectToLogin";
import routeParam from "../components/RouteParam";
import buildHandlers from "../redux/actions";
import buildSelector, { log, list } from "../redux/selectors";

const BULK_SIZE = 100;

const LogItem = ({ item }) => (
  <ListItem>
    <I18n>
      {t => (
        <ListItemText
          primary={t(`log_item_${item.type}`, item)}
          secondary={
            item.timestamp
              ? new Date(item.timestamp).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric"
                })
              : undefined
          }
        />
      )}
    </I18n>
  </ListItem>
);

export const LogView = ({
  log,
  handleChangeText,
  searchQuery,
  listId,
  list,
  logLimit,
  setLogLimit
}) => (
  <I18n>
    {t => (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Link
              tabIndex={-1}
              to={
                listId
                  ? `/lists/${listId}/entries${
                      list.preferredView === "edit" ? "/edit" : ""
                    }`
                  : "/"
              }
            >
              <IconButton color="inherit">
                <ArrowBack />
              </IconButton>
            </Link>
            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
              {t("log_title")}
              {list && ` ${list.name}`}
            </Typography>
          </Toolbar>
        </AppBar>
        {!listId && (
          <FormControl fullWidth>
            <Input
              type="text"
              placeholder={t("log_placeholder")}
              value={searchQuery || ""}
              onChange={handleChangeText}
              style={{ margin: 10 }}
            />
          </FormControl>
        )}
        <List style={{ flex: "1" }}>
          {log.slice(0, logLimit).map((item, index) => (
            <LogItem item={item} key={index} />
          ))}
        </List>
        {logLimit < log.length && (
          <InView
            as="div"
            onChange={inView => inView && setLogLimit(logLimit + BULK_SIZE)}
          >
            <Typography
              variant="button"
              color="inherit"
              style={{ textAlign: "center", marginBottom: 20 }}
            >
              {t("log_loading")}
            </Typography>
          </InView>
        )}
      </div>
    )}
  </I18n>
);

export default compose(
  redirectToLogin,
  routeParam("query", "searchQuery"),
  routeParam("id", "listId"),
  connect(
    buildSelector({ log, list }),
    buildHandlers({})
  ),
  withState("logLimit", "setLogLimit", BULK_SIZE),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (prevProps.log !== this.props.log) {
        this.props.setLogLimit(BULK_SIZE);
      }
    }
  }),
  routerContext,
  withHandlers({
    handleChangeText: ({ router: { history } }) => ({ target: { value } }) =>
      history.push(!value ? "/log" : `/log/${value}`)
  })
)(LogView);

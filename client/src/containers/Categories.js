import React from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import List from "material-ui/List";
import IconButton from "material-ui/IconButton";
import ArrowBack from "material-ui-icons/ArrowBack";
import { connect } from "react-redux";
import compose from "ramda/src/compose";

import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import routeParam from "../components/RouteParam";
import buildHandlers, { addStackableItem } from "../redux/actions";
import collapsable from "../components/Collapsable";
import buildSelector, { list } from "../redux/selectors";
import routerContext from "../components/RouterContext";
import CategoryItem from "../components/CategoryItem";

import categoryList from "../data/categories.json";

export const Categories = ({
  open,
  toggle,
  listId,
  addStackableItem,
  router
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton onClick={router.history.goBack} color="inherit">
          <ArrowBack />
        </IconButton>
        <Typography type="title" color="inherit">
          Kategorien
        </Typography>
      </Toolbar>
    </AppBar>
    <List>
      {Object.entries(categoryList).map(([category, entries]) => (
        <CategoryItem
          listId={listId}
          category={category}
          open={open[category]}
          toggle={toggle}
          entries={entries}
          key={category}
        />
      ))}
    </List>
  </div>
);

export default compose(
  routeParam("id", "listId"),
  connect(
    buildSelector({ list }),
    buildHandlers({
      addStackableItem
    })
  ),
  redirectToLogin,
  redirectToHome,
  routerContext,
  collapsable
)(Categories);

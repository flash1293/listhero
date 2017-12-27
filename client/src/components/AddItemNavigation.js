import React from "react";
import Paper from "material-ui/Paper";
import BottomNavigation, {
  BottomNavigationButton
} from "material-ui/BottomNavigation";
import ActionHistory from "material-ui-icons/History";
import ActionShoppingBasket from "material-ui-icons/ShoppingBasket";
import { Link } from "react-router-dom";
import removeFromProps from "../components/RemoveFromProps";

const BottomNavigationLink = removeFromProps("showLabel")(Link);

export default ({ uid }) => (
  <Paper
    style={{
      position: "fixed",
      bottom: 0,
      right: 0,
      left: 0
    }}
    elevation={1}
  >
    <BottomNavigation>
      <BottomNavigationLink to={`/lists/${uid}/entries/last-used`}>
        <BottomNavigationButton
          showLabel
          label="Zuletzt verwendet"
          icon={<ActionHistory />}
        />
      </BottomNavigationLink>
      <BottomNavigationLink to={`/lists/${uid}/entries/categories`}>
        <BottomNavigationButton
          showLabel
          label="Kategorien"
          icon={<ActionShoppingBasket />}
        />
      </BottomNavigationLink>
    </BottomNavigation>
  </Paper>
);

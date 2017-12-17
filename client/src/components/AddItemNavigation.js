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
      bottom: "10px",
      right: "10px",
      left: "10px"
    }}
    elevation={1}
  >
    <BottomNavigation>
      <BottomNavigationLink to={`/lists/${uid}/edit/last-used`}>
        <BottomNavigationButton
          showLabel
          label="Zuletzt verwendet"
          icon={<ActionHistory />}
        />
      </BottomNavigationLink>
      <BottomNavigationLink to={`/lists/${uid}/edit/categories`}>
        <BottomNavigationButton
          showLabel
          label="Kategorien"
          icon={<ActionShoppingBasket />}
        />
      </BottomNavigationLink>
    </BottomNavigation>
  </Paper>
);

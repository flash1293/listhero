import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { compose } from "redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { I18n } from "react-i18next";

import keymap from "../keymap";
import routerContext from "../components/RouterContext";
import redirectToLogin from "../components/RedirectToLogin";

export const Help = ({ history }) => (
  <div>
    <I18n>
      {t => (
        <React.Fragment>
          <AppBar position="static" color="primary">
            <Toolbar>
              <IconButton onClick={history.goBack} color="inherit">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" color="inherit">
                {t("shortcut_title")}
              </Typography>
            </Toolbar>
          </AppBar>
          {Object.entries(keymap).map(([area, shortcuts]) => (
            <Paper key={area} style={{ margin: "20px" }}>
              <Typography variant="h5" style={{ padding: "20px" }}>
                {t(`shortcut_${area}`)}
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("shortcut_feature")}</TableCell>
                    <TableCell>{t("shortcut_shortcut")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(shortcuts).map(([action, shortcut]) => (
                    <TableRow key={action}>
                      <TableCell>{t(`shortcut_${action}`)}</TableCell>
                      <TableCell>{shortcut}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ))}
        </React.Fragment>
      )}
    </I18n>
  </div>
);

export default compose(
  redirectToLogin,
  routerContext
)(Help);

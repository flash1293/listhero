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

export const Help = ({ syncLink, router }) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton onClick={router.history.goBack} color="inherit">
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" color="inherit">
          Shortcuts
        </Typography>
      </Toolbar>
    </AppBar>
    <I18n>
      {t => Object.entries(keymap).map(([area, shortcuts]) => (
        <Paper style={{ margin: "20px" }}>
          <Typography variant="h5" style={{ padding: "20px" }}>
            {t(`SC_${area}`)}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Funktion</TableCell>
                <TableCell>Shortcut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(shortcuts).map(([action, shortcut]) => (
                <TableRow key={action}>
                  <TableCell>{t(`SC_${action}`)}</TableCell>
                  <TableCell>{shortcut}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ))}
    </I18n>
  </div>
);

export default compose(
  redirectToLogin,
  routerContext
)(Help);

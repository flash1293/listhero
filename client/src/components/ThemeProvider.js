import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

const theme = createMuiTheme({
  typography: {
    fontFamily:
      "-apple-system,system-ui,BlinkMacSystemFont," +
      '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif'
  },
  palette: {
    primary: red
  }
});

export default ({ children }) => (
  <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
);

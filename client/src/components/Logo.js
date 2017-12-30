import React from "react";

import logoSvgInverted from "../svg/logo_inverted.svg";
import logoSvg from "../svg/logo.svg";

export const Logo = ({ inverted }) => (
  <img
    style={{ width: 30, marginRight: 15, display: "inline-block" }}
    alt="Logo"
    src={inverted ? logoSvgInverted : logoSvg}
  />
);

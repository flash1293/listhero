import React from "react";

import logoSvgInverted from "../svg/logo_inverted.svg";

export const Logo = () => (
  <img
    style={{ width: 30, marginRight: 15, display: "inline-block" }}
    alt="Logo"
    src={logoSvgInverted}
  />
);

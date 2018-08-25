import React from "react";
import SyncIcon from "@material-ui/icons/Sync";

import logoSvgInverted from "../svg/logo_inverted.svg";
import logoSvg from "../svg/logo.svg";

const DomainMarker = ({ emoji }) => (
  <span style={{ position: "absolute", right: 5, bottom: -5 }}>{emoji}</span>
);

export const Logo = ({ onClick, inverted, showSyncMarker }) => (
  <span onClick={onClick} style={{ position: "relative" }}>
    <img
      style={{ width: 30, marginRight: 15, display: "inline-block" }}
      alt="Logo"
      src={inverted ? logoSvgInverted : logoSvg}
    />
    {!showSyncMarker &&
      window.location.host.split(".")[0] === "work" && (
        <DomainMarker emoji="💼" />
      )}
    {!showSyncMarker &&
      window.location.host.split(".")[0] === "shopping" && (
        <DomainMarker emoji="🛍️" />
      )}
    {!showSyncMarker &&
      window.location.host.split(".")[0] === "throwaway" && (
        <DomainMarker emoji="🗑️" />
      )}
    {showSyncMarker && (
      <SyncIcon
        style={{ position: "absolute", right: 10, bottom: -5, width: 15 }}
      />
    )}
  </span>
);

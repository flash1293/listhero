import React from "react";

export default propToRemove => Component => props => {
  const propsToPass = { ...props };
  delete propsToPass[propToRemove];
  return <Component {...propsToPass} />;
};

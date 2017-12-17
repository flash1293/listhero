import { mapProps } from "recompose";

export default (sourceParam, targetParam) =>
  mapProps(({ match, location, history, ...ownProps }) => ({
    ...ownProps,
    [targetParam]: match.params[sourceParam]
  }));

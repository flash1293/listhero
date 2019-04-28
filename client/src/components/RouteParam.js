import { mapProps } from "recompose";

export default (sourceParam, targetParam) =>
  mapProps(props => ({
    ...props,
    [targetParam]: props.match.params[sourceParam]
  }));

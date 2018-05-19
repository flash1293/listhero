import { lifecycle } from "recompose";

export default currentView =>
  lifecycle({
    componentDidMount() {
      const {
        list: { preferredView },
        setPreferredView
      } = this.props;
      if (preferredView !== currentView)
        setPreferredView(this.props.list, currentView);
    }
  });

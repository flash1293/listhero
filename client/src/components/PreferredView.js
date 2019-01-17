import { lifecycle } from "recompose";

export default currentView =>
  lifecycle({
    componentDidMount() {
      const {
        list: { preferredView },
        setPreferredView
      } = this.props;
      this.props.visitList(this.props.list.uid);
      if (preferredView !== currentView)
        setPreferredView(this.props.list, currentView);
    },
    componentDidUpdate(prevProps) {
      if(prevProps.list.uid !== this.props.list.uid) {
        this.props.visitList(this.props.list.uid);
      }
    }
  });

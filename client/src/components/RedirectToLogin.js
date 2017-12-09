import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

export default ComponentToWrap => {
  return connect((state, ownProps) => ({
    isLoggedIn: state.user.loggedIn
  }))(
    class RedirectedComponent extends Component {
      render() {
        const { isLoggedIn, ...ownProps } = this.props;
        if (!isLoggedIn) {
          return <Redirect to="/login" />;
        } else {
          return <ComponentToWrap {...ownProps} />;
        }
      }
    }
  );
};

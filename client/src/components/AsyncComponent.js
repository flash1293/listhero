import React, { Component } from "react";

export function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      if (!this._isUnmounted) {
        this.setState({
          component: component
        });
      }
    }

    componentWillUnmount() {
      this._isUnmounted = true;
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}

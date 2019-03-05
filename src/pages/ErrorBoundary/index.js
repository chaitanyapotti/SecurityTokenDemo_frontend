import React, { Component, Suspense } from "react";
import { CircularProgress } from "@material-ui/core";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
    // maybe use raven to log errors
    // logErrorToMyService(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props || {};
    if (hasError) {
      // @aayush make some jazzy ui here
      return <h1>Error Occured. Please contact admin</h1>;
    }
    // Maybe a loader in suspense
    return <Suspense fallback={<CircularProgress />}>{children}</Suspense>;
  }
}

export default ErrorBoundary;

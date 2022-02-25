import Box from 'components/Box';
import React, { Component } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

type ErrorBoundaryProps = { children: React.ReactNode };
type ErrorBoundaryState = { hasError: boolean };

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          height='100vh'
        >
          <FiAlertTriangle color='red' size={48} />
          <h1>Something went wrong.</h1>
          <span>Please try again in a moment.</span>
        </Box>
      );
    }

    return this.props.children;
  }
}

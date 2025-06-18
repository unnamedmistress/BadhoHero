import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          margin: '1rem'
        }}>
          <h2>Something went wrong</h2>
          <details style={{ marginTop: '1rem' }}>
            <summary>Error details</summary>
            <pre style={{ marginTop: '0.5rem', fontSize: '0.875rem', textAlign: 'left' }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

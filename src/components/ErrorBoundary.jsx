import { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        if (import.meta.env.DEV) {
            console.error('Error caught by boundary:', error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = import.meta.env.BASE_URL;
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)]/70 backdrop-blur-md px-4 text-[var(--color-text-primary)]">
                    <div className="max-w-md w-full">
                        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md p-8 text-center shadow-xl">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                                    <AlertCircle size={24} className="text-red-500" />
                                </div>
                            </div>
                            <h1 className="mb-2 text-xl font-semibold">
                                Something went wrong
                            </h1>
                            <p className="mb-6 text-sm leading-6 text-[var(--color-text-secondary)]">
                                We encountered an unexpected error. Please try refreshing the page or go back to home.
                            </p>
                            {import.meta.env.DEV && (
                                <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-3 text-left">
                                    <p className="break-words font-mono text-xs text-red-600">
                                        {this.state.error?.message}
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={this.handleReset}
                                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-node-bg)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                                type="button"
                            >
                                <RefreshCw size={14} />
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;

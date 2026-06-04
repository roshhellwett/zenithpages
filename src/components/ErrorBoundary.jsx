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
        // Log to console in development
        if (import.meta.env.DEV) {
            console.error('Error caught by boundary:', error, errorInfo);
        }
        // In production, you could send to error tracking service
        // Sentry.captureException(error, { contexts: { react: errorInfo } });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/zenithpages/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-4 text-slate-800">
                    <div className="max-w-md w-full">
                        <div className="rounded-3xl border border-slate-950/[0.08] bg-white/86 p-8 text-center shadow-xl shadow-slate-950/[0.06]">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                                    <AlertCircle size={24} className="text-red-500" />
                                </div>
                            </div>
                            <h1 className="mb-2 text-xl font-semibold text-slate-950">
                                Something went wrong
                            </h1>
                            <p className="mb-6 text-sm leading-6 text-slate-500">
                                We encountered an unexpected error. Please try refreshing the page or go back to home.
                            </p>
                            {import.meta.env.DEV && (
                                <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-3 text-left">
                                    <p className="break-words font-mono text-xs text-red-600">
                                        {this.state.error?.message}
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={this.handleReset}
                                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
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

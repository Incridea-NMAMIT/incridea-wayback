import { Component, type ErrorInfo, type ReactNode } from "react";
import LiquidGlassCard from "./liquidglass/LiquidGlassCard";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="w-full h-full flex items-center justify-center p-4 min-h-[200px]">
                    <LiquidGlassCard className="p-6 text-center max-w-md w-full">
                        <h2 className="text-xl font-bold text-red-400 mb-2">3D Model Error</h2>
                        <p className="text-gray-300 text-sm mb-4">
                            {this.state.error?.message || "Something went wrong while loading the 3D model."}
                        </p>
                        <button
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-white text-sm"
                            onClick={() => this.setState({ hasError: false, error: null })}
                        >
                            Try again
                        </button>
                    </LiquidGlassCard>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

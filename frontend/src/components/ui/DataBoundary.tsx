import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";
import { ServiceState } from "@/hooks/useService";

interface DataBoundaryProps<T> {
  state: ServiceState<T> & { retry: () => void };
  loadingFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  errorFallback?: (error: Error, retry: () => void) => React.ReactNode;
  children: (data: T) => React.ReactNode;
}

export function DataBoundary<T>({
  state,
  loadingFallback,
  emptyFallback,
  errorFallback,
  children,
}: DataBoundaryProps<T>) {
  if (state.isLoading) {
    return (
      loadingFallback || (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="flex h-full w-full items-center justify-center p-6"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-accent" />
            <p className="text-sm font-medium text-text-muted animate-pulse">Loading data...</p>
          </div>
        </motion.div>
      )
    );
  }

  if (state.error) {
    if (errorFallback) {
      return errorFallback(state.error, state.retry);
    }
    
    return (
      <div className="flex h-full w-full items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex max-w-sm flex-col items-center rounded-2xl bg-danger/5 border border-danger/10 p-6 text-center"
        >
          <div className="mb-4 rounded-full bg-danger/10 p-3">
            <AlertTriangle className="h-6 w-6 text-danger" />
          </div>
          <h3 className="mb-2 font-display font-semibold text-text-main">Connection Error</h3>
          <p className="mb-6 text-sm text-text-secondary">{state.error.message}</p>
          <Button onClick={state.retry} variant="outline" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  if (state.isEmpty || state.data === null) {
    return (
      emptyFallback || (
        <div className="flex h-full w-full items-center justify-center p-6">
          <p className="text-sm text-text-muted">No data available.</p>
        </div>
      )
    );
  }

  return <>{children(state.data)}</>;
}

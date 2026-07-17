/* eslint-disable react-hooks/set-state-in-effect */
import * as React from 'react';

export type ServiceState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
};

export function useService<T>(
  serviceCall: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [state, setState] = React.useState<ServiceState<T>>({
    data: null,
    isLoading: true,
    error: null,
    isEmpty: false,
  });

  const execute = React.useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Connection timed out. Slow internet detected.')), 8000);
      });
      const result = await Promise.race([serviceCall(), timeoutPromise]);
      const isEmpty = 
        result === null || 
        result === undefined || 
        (Array.isArray(result) && result.length === 0);
        
      setState({
        data: result,
        isLoading: false,
        error: null,
        isEmpty,
      });
    } catch (err) {
      setState({
        data: null,
        isLoading: false,
        error: err instanceof Error ? err : new Error('An unknown error occurred'),
        isEmpty: false,
      });
    }
  }, [serviceCall]);

  React.useEffect(() => {
    execute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { ...state, retry: execute };
}

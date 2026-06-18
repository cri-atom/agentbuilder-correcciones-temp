// Custom hook to load window-global components on client side
export function useWindowComponent(componentName) {
  if (typeof window !== 'undefined' && window[componentName]) {
    return window[componentName];
  }
  return null;
}

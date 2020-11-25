import { useCallback, useState } from "react";

export const useForceUpdate = () => {
  const [, set] = useState();
  return useCallback(() => set(Object.create(null)), []);
};

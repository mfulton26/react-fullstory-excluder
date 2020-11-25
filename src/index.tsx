import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useClassNameInjectingApplyTrap } from "./classNameInjectingApplyTrap";
import { useForceUpdate } from "./forceUpdate";
import { ExclusionPredicate } from "./ExclusionPredicate";

import ExclusionPredicates from "./ExclusionPredicates";

type ContextProps = {
  setExclusionStrings: (
    strings: string[],
    { ignoreCase }: { ignoreCase?: boolean }
  ) => void;
};

const Context = createContext<ContextProps>({
  setExclusionStrings: () => {},
});

export const useFullStoryExcluder = () => useContext(Context);

export type FullStoryExcluderProps = {
  className?: string;
  htmlFormElements?: "all" | "freeform" | "none";
  children: () => ReactNode;
};

export default function FullStoryExcluder({
  className: fsExcludeClassName = "fs-exclude",
  htmlFormElements = "freeform",
  children: renderChildren,
}: FullStoryExcluderProps) {
  const forceUpdate = useForceUpdate();

  const [predicate, setPredicate] = useState<ExclusionPredicate>(() =>
    ExclusionPredicates.none()
  );

  useEffect(() => {
    setPredicate(() =>
      ExclusionPredicates.htmlFormElements({ group: htmlFormElements })
    );
  }, [htmlFormElements]);

  const context: ContextProps = useMemo(
    () => ({
      setExclusionStrings: (strings, options) => {
        setPredicate(() =>
          ExclusionPredicates.or(
            ExclusionPredicates.htmlFormElements({
              group: htmlFormElements,
            }),
            ExclusionPredicates.strings(strings, options)
          )
        );
      },
    }),
    [htmlFormElements]
  );

  const proxyHandler = useMemo(() => {
    const result: ProxyHandler<typeof React.createElement> = {};
    React.createElement = new Proxy(React.createElement, result);
    return result;
  }, []);

  const applyTrap = useClassNameInjectingApplyTrap(
    predicate,
    fsExcludeClassName
  );

  useEffect(() => {
    proxyHandler.apply = applyTrap;
    forceUpdate();
    return () => {
      delete proxyHandler.apply;
    };
  }, [proxyHandler, applyTrap, forceUpdate]);

  return (
    <Context.Provider value={context}>{renderChildren()}</Context.Provider>
  );
}

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
  ignoreClassName?: string;
  htmlFormElements?: "all" | "freeform" | "none";
  children: () => ReactNode;
};

export default function FullStoryExcluder({
  className: fsExcludeClassName = "fs-exclude",
  ignoreClassName = "fs-unmask",
  htmlFormElements = "freeform",
  children: renderChildren,
}: FullStoryExcluderProps) {
  const forceUpdate = useForceUpdate();

  const [predicate, setPredicate] = useState<ExclusionPredicate>(() =>
    ExclusionPredicates.none()
  );
  const [stringsExclusionPredicate, setStringsExclusionPredicate] =
    useState<ExclusionPredicate>();

  useEffect(() => {
    const classNameExclusionPredicate = ExclusionPredicates.not(
      ExclusionPredicates.className(ignoreClassName)
    );
    const htmlFormElementsExclusionPredicate =
      ExclusionPredicates.htmlFormElements({
        group: htmlFormElements,
      });
    setPredicate(() =>
      ExclusionPredicates.and(
        classNameExclusionPredicate,
        stringsExclusionPredicate === undefined
          ? htmlFormElementsExclusionPredicate
          : ExclusionPredicates.or(
              htmlFormElementsExclusionPredicate,
              stringsExclusionPredicate
            )
      )
    );
  }, [htmlFormElements, ignoreClassName, stringsExclusionPredicate]);

  const context: ContextProps = useMemo(
    () => ({
      setExclusionStrings: (strings, options) => {
        setStringsExclusionPredicate(() =>
          ExclusionPredicates.strings(strings, options)
        );
      },
    }),
    []
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

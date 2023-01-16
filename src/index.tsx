import React from "react";

import ExclusionPredicates from "./ExclusionPredicates";
import { setHandler, deleteHandler } from "./proxyHandler";

export type FullStoryExcluderProps = {
  className?: string;
  ignoreClassName?: string;
  htmlFormElements?: "all" | "freeform" | "none";
  exclusionStrings?: string[];
  exclusionStringsIgnoreCase?: boolean;
  children?: React.ReactNode;
};

export function useFullStoryExcluder({
  className: classNameToInject = "fs-exclude",
  ignoreClassName = "fs-unmask",
  htmlFormElements = "freeform",
  exclusionStrings = [],
  exclusionStringsIgnoreCase = false,
}: FullStoryExcluderProps = {}) {
  const [proxyHandlerId] = React.useState(Object.create(null));

  const stringifiedExclusionStrings = JSON.stringify(exclusionStrings);

  const predicate = React.useMemo(() => {
    console.log("recomputing predicate");

    const exclusionStrings = JSON.parse(stringifiedExclusionStrings);

    const classNameExclusionPredicate = ExclusionPredicates.not(
      ExclusionPredicates.className(ignoreClassName)
    );
    const htmlFormElementsExclusionPredicate =
      ExclusionPredicates.htmlFormElements({
        group: htmlFormElements,
      });

    const stringsExclusionPredicate = ExclusionPredicates.strings(
      exclusionStrings,
      { ignoreCase: exclusionStringsIgnoreCase }
    );

    return ExclusionPredicates.and(
      classNameExclusionPredicate,
      ExclusionPredicates.or(
        htmlFormElementsExclusionPredicate,
        stringsExclusionPredicate
      )
    );
  }, [
    stringifiedExclusionStrings,
    exclusionStringsIgnoreCase,
    htmlFormElements,
    ignoreClassName,
  ]);

  setHandler(proxyHandlerId, { classNameToInject, predicate });

  React.useEffect(() => () => deleteHandler(proxyHandlerId), [proxyHandlerId]);
}

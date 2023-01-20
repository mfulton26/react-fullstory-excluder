import React, { useEffect, useState } from "react";

import ExclusionPredicates from "./ExclusionPredicates";
import { setHandler, deleteHandler } from "./proxyHandler";

export type FullStoryExcluderOptions = {
  className?: string;
  ignoreClassName?: string;
  htmlFormElements?: "all" | "freeform" | "none";
  exclusionStrings?: string[];
  exclusionStringsIgnoreCase?: boolean;
};

export function useFullStoryExcluder({
  className: classNameToInject = "fs-exclude",
  ignoreClassName = "fs-unmask",
  htmlFormElements = "freeform",
  exclusionStrings = [],
  exclusionStringsIgnoreCase = false,
}: FullStoryExcluderOptions = {}) {
  const [proxyHandlerId] = React.useState(Object.create(null));

  const stringifiedExclusionStrings = JSON.stringify(exclusionStrings);

  // track exclusion strings that were recently changed so that while React re-renders
  // we still exclude recent "prior" strings properly until re-rendering is complete
  const [
    stringifiedExclusionStringsInState,
    setStringifiedExclusionStringsInState,
  ] = useState<string>(stringifiedExclusionStrings);
  useEffect(() => {
    setStringifiedExclusionStringsInState(stringifiedExclusionStrings);
  }, [stringifiedExclusionStrings]);

  const predicate = React.useMemo(() => {
    const exclusionStrings: string[] = JSON.parse(stringifiedExclusionStrings);

    if (stringifiedExclusionStringsInState !== stringifiedExclusionStrings) {
      // merge previous/current exclusion strings during re-rendering
      const seen = new Set(exclusionStrings);
      JSON.parse(stringifiedExclusionStringsInState).forEach(
        (string: string) => {
          if (seen.has(string)) {
            return;
          }
          seen.add(string);
          exclusionStrings.push(string);
        }
      );
    }

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

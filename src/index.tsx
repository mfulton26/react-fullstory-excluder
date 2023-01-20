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

  const [
    delayedStringifiedExclusionStrings,
    setDelayedStringifiedExclusionStrings,
  ] = useState<string>(stringifiedExclusionStrings);

  const predicate = React.useMemo(() => {
    const exclusionStrings: string[] = JSON.parse(stringifiedExclusionStrings);

    if (delayedStringifiedExclusionStrings !== stringifiedExclusionStrings) {
      // merge previous/current exclusion strings during re-rendering
      const seen = new Set(exclusionStrings);
      JSON.parse(delayedStringifiedExclusionStrings).forEach(
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
    delayedStringifiedExclusionStrings,
    exclusionStringsIgnoreCase,
    htmlFormElements,
    ignoreClassName,
  ]);

  setHandler(proxyHandlerId, { classNameToInject, predicate });

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setDelayedStringifiedExclusionStrings(stringifiedExclusionStrings),
      0
    );
    return () => clearTimeout(timeoutId);
  }, [stringifiedExclusionStrings]);

  React.useEffect(() => () => deleteHandler(proxyHandlerId), [proxyHandlerId]);
}

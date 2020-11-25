import React, { useMemo } from "react";
import { ExclusionPredicate } from "./ExclusionPredicate";

export const useClassNameInjectingApplyTrap = (
  predicate: ExclusionPredicate,
  className: string
) =>
  useMemo(() => {
    const shouldInjectClassName = (
      thisArgument: unknown,
      argumentsList: Parameters<typeof React.createElement>
    ) => Reflect.apply(predicate, thisArgument, argumentsList);

    const injectClassName = (
      argumentsList: Parameters<typeof React.createElement>
    ) => {
      const [type, props, ...children] = argumentsList;
      const { className: currentClassName } = (props ?? {}) as {
        className?: string;
      };
      const newClassName = currentClassName
        ? `${currentClassName} ${className}`
        : className;
      const newProps = { ...props, className: newClassName };
      const newArgumentsList = [type, newProps, ...children];
      return newArgumentsList;
    };

    return (
      target: typeof React.createElement,
      thisArgument: unknown,
      argumentsList: Parameters<typeof React.createElement>
    ) => {
      if (shouldInjectClassName(thisArgument, argumentsList)) {
        const newArgumentsList = injectClassName(argumentsList);
        return Reflect.apply(target, thisArgument, newArgumentsList);
      }
      return Reflect.apply(target, thisArgument, argumentsList);
    };
  }, [predicate, className]);

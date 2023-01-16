import React from "react";

import type { ExclusionPredicate } from "./ExclusionPredicates";

export type Handler = {
  classNameToInject: string;
  predicate: ExclusionPredicate;
};

const handlersById = new Map<unknown, Handler>();

export function setHandler(handlerId: unknown, handler: Handler) {
  handlersById.set(handlerId, handler);
}

export function deleteHandler(handlerId: unknown) {
  handlersById.delete(handlerId);
}

function createArgumentsListWithInjectedClassNames(
  argumentsList: Parameters<typeof React.createElement>,
  classNamesToInject: string[]
) {
  const toInject = classNamesToInject.join(" ");
  const [type, props, ...children] = argumentsList;
  const { className } = (props ?? {}) as { className?: string };
  const newClassName = className ? `${className} ${toInject}` : toInject;
  const newProps = { ...props, className: newClassName };
  return [type, newProps, ...children];
}

function apply(
  target: typeof React.createElement,
  thisArgument: unknown,
  argumentsList: Parameters<typeof React.createElement>
) {
  const classNamesToInject = new Set<string>([]);
  handlersById.forEach(({ classNameToInject, predicate }) => {
    if (Reflect.apply(predicate, thisArgument, argumentsList)) {
      classNamesToInject.add(classNameToInject);
    }
  });
  if (classNamesToInject.size) {
    const newArgumentsList = createArgumentsListWithInjectedClassNames(
      argumentsList,
      Array.from(classNamesToInject)
    );
    return Reflect.apply(target, thisArgument, newArgumentsList);
  }
  return Reflect.apply(target, thisArgument, argumentsList);
}

React.createElement = new Proxy(React.createElement, { apply });

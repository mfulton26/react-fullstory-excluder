import escapeStringRegexp from "escape-string-regexp";

import { ExclusionPredicate } from "./ExclusionPredicate";

const nonePredicate: ExclusionPredicate = () => false;

const none = (): ExclusionPredicate => nonePredicate;

const allHtmlFormElements: ExclusionPredicate = (type) => {
  switch (type) {
    case "button":
    case "fieldset":
    case "input":
    case "object":
    case "output":
    case "select":
    case "textarea":
      return true;
    default:
      return false;
  }
};

const freeformHtmlFormElementsPredicate: ExclusionPredicate = (
  type,
  props
): boolean => {
  switch (type) {
    case "input":
      switch ((props as { type: string } | null)?.type) {
        case "button":
        case "checkbox":
        case "color":
        case "date":
        case "datetime-local":
        case "hidden":
        case "month":
        case "number":
        case "radio":
        case "range":
        case "reset":
        case "submit":
        case "time":
        case "week":
          return false;
        default:
          return true;
      }
    case "textarea":
      return true;
    default:
      return false;
  }
};

const htmlFormElements = ({
  group = "all",
}: {
  group?: "all" | "freeform" | "none";
} = {}): ExclusionPredicate => {
  switch (group) {
    case "all":
      return allHtmlFormElements;
    case "freeform":
      return freeformHtmlFormElementsPredicate;
    case "none":
    default:
      return nonePredicate;
  }
};

const or = (
  a: ExclusionPredicate,
  b: ExclusionPredicate
): ExclusionPredicate => (...args) => a(...args) || b(...args);

const strings = (
  texts: string[],
  {
    ignoreCase = false,
    multiline = false,
  }: { ignoreCase?: boolean; multiline?: boolean } = {}
): ExclusionPredicate => {
  const nonEmptyTexts = texts.filter(Boolean);
  if (nonEmptyTexts.length === 0) {
    return none();
  }
  const regExp = new RegExp(
    nonEmptyTexts.map((text) => escapeStringRegexp(text)).join("|"),
    `${ignoreCase ? "i" : ""}${multiline ? "m" : ""}`
  );
  return (_type, _props, ...children) =>
    children.some(
      (child) =>
        (typeof child === "string" && regExp.test(child)) ||
        (typeof child === "number" && regExp.test(`${child}`))
    );
};

const ExclusionPredicates = {
  none,
  htmlFormElements,
  or,
  strings,
};

export default ExclusionPredicates;

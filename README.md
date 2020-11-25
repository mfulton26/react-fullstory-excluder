# react-fullstory-excluder

[![npm package][npm-badge]][npm]

Get FullStory exclusion of sensitive data without the hassle of manually placing `fs-exclude` on every element yourself.

## Getting Started

You need to register a `FullStoryExcluder` at the base of your app. This allows `react-fullstory-excluder` to reliably inject `fs-exclude` class name throughout your app.

### Registration

Wrap your `App` component with `FullStoryExcluder`:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FullStoryExcluder } from "react-fullstory-excluder";

ReactDOM.render(
  <FullStoryExcluder>{() => <App />}</FullStoryExcluder>,
  document.getElementById("root")
);
```

### Excluding elements that include certain text

To exclude all usages of certain text throughout your app (e.g. PII) you can use `setExclusionStrings` wherever you have access to your data you want to exclude in FullStory:

```jsx
const { setExclusionStrings } = useFullStoryExcluder();

React.useEffect(() => {
  setExclusionStrings([name, socialSecurityNumber, phoneNumber]);
}, [setExclusionStrings, name, socialSecurityNumber, phoneNumber]);
```

## `FullStoryExcluder` options

| option             | type                            | default        | description                                                              |
| ------------------ | ------------------------------- | -------------- | ------------------------------------------------------------------------ |
| `className`        | `string`                        | `"fs-exclude"` | the `class` name to inject to exclude things in FullStory                |
| `htmlFormElements` | `"all" \| "freeform" \| "none"` | `"freeform"`   | which elements to exclude in FullStory regardless of their content/value |

## `setExclusionStrings` options

| option       | type      | default | description                                                       |
| ------------ | --------- | ------- | ----------------------------------------------------------------- |
| `ignoreCase` | `boolean` | `false` | specifies ignoring case when matching text in elements to exclude |

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.com/package/react-fullstory-excluder

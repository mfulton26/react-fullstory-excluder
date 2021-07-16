# react-fullstory-excluder

Get FullStory exclusion of sensitive data without the hassle of manually placing `fs-exclude` on every element yourself.

## Limitations

Does not work with the [new JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)… yet. 😀

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

See also [`FullStoryExcluder` options](#fullstoryexcluder-options).

### Excluding elements that include certain text

To exclude all usages of certain text throughout your app (e.g. PII) you can use `setExclusionStrings` wherever you have access to your data you want to exclude in FullStory:

```jsx
import { useFullStoryExcluder } from "react-fullstory-excluder";
```

```jsx
const { setExclusionStrings } = useFullStoryExcluder();

React.useEffect(() => {
  setExclusionStrings([name, socialSecurityNumber, phoneNumber]);
}, [setExclusionStrings, name, socialSecurityNumber, phoneNumber]);
```

See also [`setExclusionStrings` options](#setexclusionstrings-options).

## `FullStoryExcluder` options

### `className`

the `class` name to inject to exclude things in FullStory

type: `string`

default: `"fs-exclude"`

### `ignoreClassName`

space delimited list of `class` names to check for before injecting; if any of the `class` names are present then the excluding [`className`](#classname) will not be injected

type: `string`

default: `"fs-unmask"`

### `htmlFormElements`

which elements to automatically exclude in FullStory

type: `"all" | "freeform" | "none" = "freeform"`

default: `"freeform"`

## `setExclusionStrings` options

### `ignoreCase`

specifies ignoring case when matching text in elements to exclude

type: `boolean`

default: `false`

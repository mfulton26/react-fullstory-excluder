# react-fullstory-excluder

Get FullStory exclusion of sensitive data without the hassle of manually placing `fs-exclude` on every element yourself.

## Limitations

Does not work with the [new JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)… yet. 😀

## Getting Started

You need to register a `FullStoryExcluder` at the base of your app. This allows `react-fullstory-excluder` to reliably inject `fs-exclude` class name throughout your app.

### Registration

Call the hook from any component in your app:

```jsx
import { useFullStoryExcluder } from "react-fullstory-excluder";

function SomeComponent() {
  useFullStoryExcluder();

  return <>some content</>;
}
```

## `useFullStoryExcluder` options

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

type: `"all" | "freeform" | "none"`

default: `"freeform"`

### `exclusionStrings`

which strings to automatically exclude in FullStory

type: `string[]`

default: `[]`

### `exclusionStringsIgnoreCase`

specifies ignoring case when matching text in elements to exclude

type: `boolean`

default: `false`

# Welcome to VoidUI ✨

## Looking for the documentation?

https://voiddevs.org/ui

## Installing VoidUI
```sh
$ yarn add @voidpkg/react-ui
# or
$ npm install --save @voidpkg/react-ui
```

# Getting set up

To start using the components, please follow these steps:

1. Add the `content` option to your `tailwind.config.js` file:

```jsx
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@voidpkg/react-ui/**/*.{js,jsx,ts,tsx}",
    ... // your other content
  ],
  ... // your other config
}

```

2. Wrap your application in a `Provider`

```jsx
import { Provider } from "@voidpkg/react-ui"

const App = ({ children }) => (
  <Provider>
    {children}
  </Provider>
)
```
3. Now you can start using components like so!:

```jsx
import { Button } from "@voidpkg/react-ui";

const Index = () => <Button>
  ✨ Hello, world!
</Button>
```

## Components

`Accordion`, `Button`, `CodeMockup`, `ContextMenu`, `Dropdown`, `Highlight`, `Hover`, `HoverCard`, `Modal`, `Video`, `Pointer`, `Range`, `Ripple`, `Spinner`, `Switch`, `Tabs`, `Tooltip`

## Hooks

`useSWR`, `useBrowser`, `useToast`

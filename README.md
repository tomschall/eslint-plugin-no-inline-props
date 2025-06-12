# eslint-plugin-no-inline-props

🚫 Disallows passing inline objects, functions, or JSX directly as props in React components.  
✅ Helps avoid unnecessary re-renders by preventing new object/function/JSX references on every render – both with and without `React.memo`.

## ❗ Problem

```tsx
<UniversalLink item={{ '@id': '/a' }} />
<UniversalLink onClick={() => doSomething()} />
<UniversalLink>{<h1>Hello</h1>}</UniversalLink>
<UniversalLink children={<h1>Hello</h1>} />
```

This creates **new references on every render** → breaks memoization.

## ✅ Rule: no-inline-props

**Warns** when props are passed as:

- inline objects: `{ foo: 'bar' }`
- inline arrow functions: `() => {}`
- inline JSX: `{<h1>Title</h1>}`

## ✅ Example

Define the object outside of the component:

```ts
// ✅ GOOD
const item = { '@id': '/a' };
```

and then pass `item` as a prop:

```tsx
<UniversalLink item={item} />
```

## ❌ Example

```tsx
// ❌ BAD
<UniversalLink item={{ '@id': '/a' }} />
```

## 🔧 Usage

```bash
npm install eslint-plugin-no-inline-props --save-dev
```

.eslintrc.js:

```js
plugins: ['no-inline-props'],
rules: {
  'no-inline-props/no-inline-props': 'warn',
  {
    excludeProps: [],
    ignoreHtmlTags: true,
  },
}
```

## 💡 Why use this plugin?

React creates new object and function references every time a component renders – even if the values haven't changed.
Passing inline objects, functions, or JSX as props or children **prevents React from optimizing rendering**, especially when using `React.memo` or deeply nested components.

## What is covered?

This plugin helps you **avoid unintentional re-renders** by warning about:

- ⚠️ **Inline object props**

  ```tsx
  <Component item={{ id: '123' }} />
  ```

- ⚠️ **Inline function props**

  ```tsx
  <Component onClick={() => doSomething()} />
  ```

- ⚠️ **Inline JSX passed via `{}` (expression containers)**

  ```tsx
  <Component>{<h1>Hello</h1>}</Component>
  ```

- ⚠️ **Inline JSX passed as `children` prop**

  ```tsx
  <Component children={<h1>Hello</h1>} />
  ```

## What is not covered?

This rule does **not** warn about:

- Static JSX elements without expression containers:

  ```tsx
  <Component>
    <h1>Hello</h1>
  </Component>
  ```

- JSX with only identifiers inside `{}`:

  ```tsx
  <div>
    <span>{test}</span>
  </div>
  ```

- Stable function references:

  ```tsx
  <button onClick={fn} />
  ```

---

## ⚙️ Customization options

You can fine-tune the rule to suit your use case:

```js
'no-inline-props/inline-props': [
  'warn',
  {
    excludeProps: ['children', 'style'], // Ignore specific props
    ignoreHtmlTags: true,                // Allow inline JSX on native HTML elements
  },
],
```

| Option           | Description                                                           |
| ---------------- | --------------------------------------------------------------------- |
| `excludeProps`   | Ignore specific prop names like `style`, `children`, or `className`   |
| `ignoreHtmlTags` | Ignores inline JSX usage on native HTML tags (e.g. `<div>`, `<span>`) |

---

## 🧠 Why not just fix it in React?

Because ESLint can **catch these cases early** – even before runtime performance issues appear.
This rule helps keep your components **reference-stable**, **memo-friendly**, and **cleanly separated** by design.

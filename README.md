# eslint-plugin-no-inline-props

🚫 Disallows passing inline objects/functions/JSX as props in React components.  
✅ Helps avoid unnecessary re-renders when using `React.memo`.

## ❗ Problem

```jsx
<UniversalLink item={{ '@id': '/a' }} />
<UniversalLink onClick={() => doSomething()} />
<UniversalLink>{<h1>Hello</h1>}</UniversalLink>
```

This creates **new references on every render** → breaks memoization.

## ✅ Rule: no-inline-props

**Warns** when props are passed as:

- inline objects: `{ foo: 'bar' }`
- inline arrow functions: `() => {}`
- inline JSX: `{<h1>Title</h1>}`

## ✅ Example

Define the object outside of the component:

```js
// ✅ GOOD
const item = { "@id": "/a" }
```

and then pass `item` as a prop:

```jsx
<UniversalLink item={item} />
```

## ❌ Example

```jsx
// ❌ BAD
<UniversalLink item={{ "@id": "/a" }} />
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
}
```

import { RuleTester } from 'eslint';
import rule from '../rules/no-inline-props';

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, ecmaFeatures: { jsx: true } },
});

ruleTester.run('no-inline-props', rule, {
  valid: [
    { code: 'const obj = {}; <Component item={obj} />;' },
    { code: 'const handle = () => {}; <Component onClick={handle} />;' },
    {
      code: 'const content = <h1>Hello</h1>; <Component>{content}</Component>;',
    },
  ],
  invalid: [
    {
      code: '<Component item={{ foo: "bar" }} />',
      errors: [{ message: /Inline prop "item"/ }],
    },
    {
      code: '<Component onClick={() => {}} />',
      errors: [{ message: /Inline prop "onClick"/ }],
    },
    {
      code: '<Component>{<h1>Inline</h1>}</Component>',
      errors: [{ message: /Inline prop "children"/ }],
    },
  ],
});

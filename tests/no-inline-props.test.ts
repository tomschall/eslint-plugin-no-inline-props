import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../rules/rule-impl.ts';
import { TSESLint } from '@typescript-eslint/utils';

const ruleTester = new RuleTester();

ruleTester.run(
  'no-inline-props',
  rule as TSESLint.RuleModule<'inlineProp', []>,
  {
    valid: [
      {
        code: 'const obj = {}; <Component item={obj} />;',
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
      },
      {
        code: 'const handle = () => {}; <Component onClick={handle} />;',
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
      },
      {
        code: 'const content = <h1>Hello</h1>; <Component>{content}</Component>;',
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
      },
    ],
    invalid: [
      {
        code: '<Component item={{ foo: "bar" }} />',
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
        errors: [
          {
            messageId: 'inlineProp',
            data: {
              name: 'item',
              type: 'ObjectExpression',
            },
          },
        ],
      },
      {
        code: '<Component onClick={() => {}} />',
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
        errors: [
          {
            messageId: 'inlineProp',
            data: {
              name: 'onClick',
              type: 'ArrowFunctionExpression',
            },
          },
        ],
      },
      {
        code: '<Component>{<h1>Inline</h1>}</Component>',
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
        errors: [
          {
            messageId: 'inlineProp',
            data: {
              name: 'children',
              type: 'JSXElement',
            },
          },
        ],
      },
      {
        code: '<Component><h1>Inline</h1></Component>',
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
        errors: [
          {
            messageId: 'inlineProp',
            data: {
              name: 'children',
              type: 'JSXElement',
            },
          },
        ],
      },
    ],
  },
);

import { RuleTester } from '@typescript-eslint/rule-tester';
import rule, { Options } from '../rules/rule-impl.ts';
import { TSESLint } from '@typescript-eslint/utils';

const ruleTester = new RuleTester();

ruleTester.run(
  'no-inline-props',
  rule as TSESLint.RuleModule<'inlineProp', Options>,
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
      {
        code: `
        const content = <span><strong>Hello</strong></span>;
        <Component>{content}</Component>;
      `,
        options: [{ excludeTags: ['span'] }],
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
      },
      {
        code: `
        const table = <TableCell><h1>Test</h1></TableCell>;
        <Component>{table}</Component>;
      `,
        options: [{ excludeTags: ['TableCell'] }],
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
      },
      {
        code: `
        const content = <h1>Hello</h1>;
        <MyComponent>{content}</MyComponent>;
      `,
        options: [{ excludeTags: ['MyComponent'] }],
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
      {
        code: '<Custom><h1>Hello</h1></Custom>',
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
        options: [{ excludeTags: ['MyComponent'] }],
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
        code: `
        <MyComponent>
          <div><h1>Bad JSX</h1></div>
        </MyComponent>
      `,
        options: [{ excludeTags: ['Custom', 'Component'] }],
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

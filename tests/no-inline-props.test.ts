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
        code: '<Component><h1>Inline</h1></Component>',
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
      },
      {
        code: '<Custom><h1><span>Hello</span></h1></Custom>',
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
      },
      // That's valid because it is an identifier, not a JSX element
      {
        code: `
        <MyComponent>
          <div><h1><span>{test}</span></h1></div>
        </MyComponent>
      `,
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
      },
      // Some valid examples when excluding props
      {
        code: '<Component item={obj} test={{test: "abc"}} />;',
        options: [{ excludeProps: ['test'] }],
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
      },
      {
        code: '<Component item={obj} children={<h1>Some Text</h1>} />;',
        options: [{ excludeProps: ['children'] }],
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
      },
      // Test with ignoreHtmlTags option
      {
        code: '<button onClick={handle} children={test} />;',
        options: [{ ignoreHtmlTags: false }],
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
      },
      {
        code: '<button onClick={handle} children={<h1>Some Text</h1>} />;',
        options: [{ ignoreHtmlTags: false, excludeProps: ['children'] }],
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
        code: '<Component><div>{<div><h1>Inline</h1></div>}</div></Component>',
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
        code: '<Component onClick={() => {}}>{<div>test with children</div>}</Component>',
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
        code: '<Component item={{ foo: "bar" }} children={<h1>test with children</h1>} />',
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
          {
            messageId: 'inlineProp',
            data: {
              name: 'children',
              type: 'JSXElement',
            },
          },
        ],
      },
      // Test with ignoreHtmlTags option
      {
        code: '<button onClick={() => {}} children={<h1>test with children</h1>} />',
        options: [{ ignoreHtmlTags: false }],
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

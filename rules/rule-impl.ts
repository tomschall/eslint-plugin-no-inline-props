import { TSESTree, TSESLint } from '@typescript-eslint/utils';

export type Options = [
  {
    excludeProps?: string[];
    ignoreHtmlTags?: boolean;
  },
];

const rule: TSESLint.RuleModule<'inlineProp', Options> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow inline props (JSXElement, ObjectExpression, FunctionExpression)',
    },
    messages: {
      inlineProp:
        '⚠️ Inline prop "{{name}}" detected ({{type}}). Extract to a variable.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          excludeProps: {
            type: 'array',
            items: { type: 'string' },
          },
          ignoreHtmlTags: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ ignoreHtmlTags: true }],
  create(context: TSESLint.RuleContext<'inlineProp', Options>) {
    const [options] = context.options;
    const excludeProps = new Set(options?.excludeProps ?? []);

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        const parent = node.parent as TSESTree.JSXOpeningElement;
        const tagName =
          parent.name.type === 'JSXIdentifier' ? parent.name.name : null;

        const ignoreHtmlTags = options?.ignoreHtmlTags ?? true;

        if (ignoreHtmlTags && tagName && /^[a-z]/.test(tagName)) {
          return;
        }

        const propName = node.name.name;
        if (typeof propName !== 'string') return;
        if (excludeProps.has(propName)) return;

        const val =
          node.value?.type === 'JSXExpressionContainer'
            ? node.value.expression
            : null;

        if (!val) return;

        const isInline =
          val.type === 'ObjectExpression' ||
          val.type === 'ArrowFunctionExpression' ||
          val.type === 'FunctionExpression' ||
          val.type === 'JSXElement';

        if (isInline) {
          context.report({
            node,
            messageId: 'inlineProp',
            data: {
              name: propName,
              type: val.type,
            },
          });
        }
      },

      JSXExpressionContainer(node: TSESTree.JSXExpressionContainer) {
        const expr = node.expression;

        // 🛑 Prevent duplicate reports in props
        if (node.parent?.type === 'JSXAttribute') return;

        const INLINE_TYPES = new Set([
          'JSXElement',
          'JSXFragment',
          'ObjectExpression',
          'ArrowFunctionExpression',
          'FunctionExpression',
        ]);

        if (expr && INLINE_TYPES.has(expr.type)) {
          context.report({
            node: expr,
            messageId: 'inlineProp',
            data: {
              name: 'children',
              type: expr.type,
            },
          });
        }
      },
    };
  },
};

export default rule;

// @ts-check
/**
 * Preset ESLint FLAT base do monorepo Charya.
 *
 * §7 (Arquitetura Técnica): ESLint flat + typescript-eslint é a FONTE DA VERDADE
 * de lint type-aware. oxlint roda como pré-passo rápido (ver oxlint.json) — não
 * substitui este preset. eslint-config-prettier desliga regras de formatação
 * (Prettier cuida de formato).
 *
 * Uso (apps/packages):
 *   import base from '@charya/config/eslint/base';
 *   export default [...base];
 *
 * Variantes: ./eslint.node.js, ./eslint.react.js, ./eslint.react-native.js
 */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

/**
 * Globs ignorados em todo o monorepo (build, deps, artefatos de tooling).
 * @type {import('eslint').Linter.Config}
 */
export const ignores = {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/.expo/**',
    '**/.turbo/**',
    '**/coverage/**',
    '**/*.tsbuildinfo',
  ],
};

/**
 * Config base reutilizável. Array flat — espalhe em qualquer eslint.config.js.
 * @type {import('typescript-eslint').ConfigArray}
 */
export const base = tseslint.config(
  ignores,
  js.configs.recommended,
  // Conjunto type-aware (precisa de projectService → tsconfig do consumidor).
  ...tseslint.configs.recommendedTypeChecked,
  {
    name: 'charya/base/language-options',
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        // projectService resolve o tsconfig mais próximo automaticamente
        // (substitui a lista manual de `project`).
        projectService: true,
        // tsconfigRootDir é setado pelo consumidor via import.meta.dirname.
      },
    },
  },
  {
    name: 'charya/base/rules',
    rules: {
      // §7: "proibido any sem justificativa" — erro em vez de warn.
      '@typescript-eslint/no-explicit-any': 'error',
      // Validação de borda é sempre via Zod; nada de unsafe silencioso.
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      // Permite `_unused` intencional (alinha com noUnusedLocals do tsconfig).
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Consistência de imports de tipo (casa com verbatimModuleSyntax).
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // Promessas: erros financeiros/async não podem ser engolidos.
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },
  // Arquivos de teste: regras type-aware mais frouxas (mocks, fixtures).
  {
    name: 'charya/base/tests',
    files: ['**/*.{test,spec}.{ts,tsx}', '**/test/**', '**/__tests__/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  // Arquivos JS de config (eslint.config.js, etc.): sem type-checking.
  {
    name: 'charya/base/config-files',
    files: ['**/*.{js,mjs,cjs}', '**/*.config.{ts,mts,cts}'],
    ...tseslint.configs.disableTypeChecked,
  },
  // SEMPRE por último: desliga regras conflitantes com Prettier.
  eslintConfigPrettier,
);

export default base;

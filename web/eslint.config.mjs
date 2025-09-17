import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';
import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    {
        ignores: ['node_modules/**', '.next/**', 'out/**', 'src/components/ui/**', 'src/hooks/**', 'src/lib/**'],
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptEslintParser,
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
            '@next/next': nextPlugin,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            semi: [1, 'always'],
        },
    },
    ...compat.config({
        extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
        settings: {
            next: {
                rootDir: './',
            },
        },
    }),
    {
        rules: {
            'prefer-arrow-callback': ['warn', { allowNamedFunctions: true }],
            'arrow-body-style': ['warn', 'as-needed'],
        },
    },
];

export default eslintConfig;

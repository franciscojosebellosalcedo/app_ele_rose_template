module.exports = {
  parser: '@typescript-eslint/parser', // Especifica el parser de TypeScript para ESLint
  parserOptions: {
    ecmaVersion: 2020, // Permite el uso de características modernas de ECMAScript
    sourceType: 'module', // Permite el uso de imports
    ecmaFeatures: {
      jsx: true, // Permite el parsing de JSX
    },
  },
  settings: {
    react: {
      version: 'detect', // Detecta automáticamente la versión de React a usar
    },
  },
  extends: [
    'plugin:react/recommended', // Usa las reglas recomendadas de eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Usa las reglas recomendadas para TypeScript
    'plugin:prettier/recommended', // Habilita eslint-plugin-prettier y eslint-config-prettier
  ],
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    // Puedes desactivar las reglas que no necesites o ajustar a tu preferencia
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Desactiva la necesidad de definir tipos de retorno en funciones
    '@typescript-eslint/no-explicit-any': 'warn', // Muestra advertencias cuando se usa `any`
    'react/prop-types': 'off', // Desactiva la verificación de PropTypes, ya que usarás TypeScript
  },
};

import ts from "@wessberg/rollup-plugin-ts";

export default {
  input: 'src/styleCond.ts',
  output: {
    interop: true,
    dir: 'build',
    format: 'cjs'
  },
  plugins: [ts()]
};

import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/styleCond.ts',
  output: {
    sourcemap: true,
    interop: true,
    dir: 'build',
    format: 'cjs'
  },
  plugins: [typescript()]
};

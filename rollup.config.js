import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/styleCond.ts',
  output: {
    interop: true,
    dir: 'build',
    format: 'cjs'
  },
  plugins: [typescript()]
};

import tsconfig from './tsconfig.json';
import tsconfigPaths from 'tsconfig-paths';

const baseUrl = './build'; // `dist` 是您編譯後的文件所在目錄
tsconfigPaths.register({
    baseUrl,
    paths: tsconfig.compilerOptions.paths,
});

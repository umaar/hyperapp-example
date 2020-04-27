import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const development = Boolean(process.env.ROLLUP_WATCH);

export default {
	input: 'src/index.js',
	output: {
		file: 'dist/index.min.js',
		sourcemap: development ? 'inline' : false,
		format: 'iife'
	},
	plugins: [
		resolve({jsnext: true,
			browser: true}),
		commonjs({
			exclude: 'src/**'
		}),
		babel({
			exclude: 'node_modules/**'
		}),
		development && livereload('dist'),
		development &&
    serve({
    	contentBase: ['.'],
    	historyApiFallback: true,
    	port: 8080
    })
	]
};

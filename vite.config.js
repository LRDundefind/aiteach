
import {defineConfig, loadEnv} from "vite";
import { visualizer } from 'rollup-plugin-visualizer'
import vue from "@vitejs/plugin-vue";
import { resolve } from 'path';
import requireTransform from 'vite-plugin-require-transform';
import path from 'path'
import commonjs from 'rollup-plugin-commonjs';
//以下三项为配置element Plus 自动按需导入
// import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// import legacy from '@vitejs/plugin-legacy'
// https://vitejs.dev/config/
export default defineConfig(({command,mode}) => {
    let base = '';
    if (command === 'build') {
        switch (mode){
            case 'development':
                base = '/v3/';
                break;
            case 'preview':
                base = '/preview/';
                break;
            case 'gray':
                base = '/edu/gray/';
                break;
            case 'production':
                base = '/edu/h5/';
                break;
            default :
                base = '';
        }
    } else {
        base = ''
    }
    return {
        plugins: [
            visualizer(),
            commonjs(),
            // AutoImport({
            //   resolvers: [
            //     // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
            //     ElementPlusResolver()
            //   ],
            // }),
            // Components({
            //   resolvers: [
            //     // 自动导入 Element Plus 组件
            //     ElementPlusResolver(),
            //   ],
            // }),
            vue(),
            requireTransform({
                fileRegex: /.js$|.vue$|.png/
              }),
             
            //   legacy({
            //     targets: ['Chrome 64'],
            //     additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
            //     polyfills:[
            //         'es.symbol',
            //         'es.array.filter',
            //         'es.promise',
            //         'es.promise.finally',
            //         'es/map',
            //         'es/set',
            //         'es.array.for-each',
            //         'es.object.define-properties',
            //         'es.object.define-property',
            //         'es.object.get-own-property-descriptor',
            //         'es.object.get-own-property-descriptors',
            //         'es.object.keys',
            //         'es.object.to-string',
            //         'web.dom-collections.for-each',
            //         'esnext.global-this',
            //         'esnext.string.match-all'
            //     ],
            //     modernPolyfills: true
            // }),
        ],
        envDir: path.resolve(__dirname, './env'),
        base: base,
        server: {
            hmr:true,
            host: "0.0.0.0",
            port: 3000,
            proxy: {
                '/medAI/preview/teach': {
                    target: 'http://192.168.8.88:8084/',
                    changeOrigin: true,
                    rewrite: (path) => path.replace('/medAI/preview/teach/','')
                },
                "/medAI/v3/teach": {
                    target: 'http://192.168.8.88:8083/',
                    changeOrigin: true,
                    rewrite: (path) => path.replace('/medAI/v3/teach/','')
                },
            },
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
                "~": path.resolve(__dirname, "./node_modules"),
                vue$: "vue/dist/vue.runtime.esm.js",
            },
                // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
        },
        build: {
            emptyOutDir: true,
            chunkSizeWarningLimit: 1500,
            minify: true, // 开启压缩
            rollupOptions: {
                treeshake: true, // 开启 Tree Shaking，消除未使用的代码，减小最终的包大小
                input: {
                    app: path.resolve(__dirname, 'index.html'),
                    qs: path.resolve(__dirname, 'qs.html'),
                },
                output: {
                    chunkFileNames: 'js/[name]-[hash].js',
                    entryFileNames: 'js/[name]-[hash].js',
                    assetFileNames: '[ext]/[name]-[hash].[ext]',
                }
            }
        }
    }
});

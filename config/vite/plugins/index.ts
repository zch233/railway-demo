import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { ConfigEnv } from 'vite';
import { configPluginHtml } from './vitePluginHtml';
import { configSvgIconsPlugin } from './vitePluginSvgIcons';
import { configPluginLegacy } from './vitePluginLegacy';
import { configPluginImagemin } from './vitePluginImagemin';
import { configPluginVisualizer } from './rollupPluginVisualizer';
import { configPluginCompression } from './vitePluginCompression';
import { configPluginWindicss } from './vitePluginWindicss';
import { configPluginCertificate } from './vitePluginMkcert';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

export const createVitePlugins = ({ mode, command }: ConfigEnv, viteEnv: ViteEnv) => {
    const isBuild = command === 'build';
    const { VITE_WINDICSS, VITE_SEE_VISUALIZER, VITE_LEGACY, VITE_USE_IMAGEMIN, VITE_LISTEN_HTTPS } = viteEnv;
    // https://github.com/vitejs/awesome-vite#plugins
    // vite-plugin-pages // 自动根据目录生成路由
    // unplugin-vue-components // 组件自动按需导入
    // unplugin-auto-import // 依赖按需自动导入
    const plugins = [
        vue(),
        vueJsx(),
        // support name
        vueSetupExtend(),
        configPluginHtml(isBuild, viteEnv),
        configSvgIconsPlugin(isBuild),
    ];

    if (VITE_LISTEN_HTTPS) plugins.push(configPluginCertificate());

    if (VITE_WINDICSS) plugins.push(configPluginWindicss());

    if (VITE_SEE_VISUALIZER) plugins.push(configPluginVisualizer());

    if (isBuild) {
        plugins.push(configPluginCompression(viteEnv));
        if (VITE_LEGACY) plugins.push(configPluginLegacy());
        if (VITE_USE_IMAGEMIN) plugins.push(configPluginImagemin());
    }
    return plugins;
};
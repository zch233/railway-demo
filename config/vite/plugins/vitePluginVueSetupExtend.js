import vueSetupExtend from 'vite-plugin-vue-setup-extend';

// 支持在 setup 上使用组件 name
// example: <script setup name='XXX'>...</script>
export const configPluginVueSetupExtend = () => vueSetupExtend();

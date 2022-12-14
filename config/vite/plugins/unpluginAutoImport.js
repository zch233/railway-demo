import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
/* eslint-disable no-unused-vars*/
import {
    AntDesignVueResolver,
    AntDesignVueResolverOptions,
    ArcoResolver,
    ArcoResolverOptions,
    DevResolverOptions,
    DevUiResolver,
    ElementPlusResolver,
    ElementPlusResolverOptions,
    ElementUiResolver,
    ElementUiResolverOptions,
    HeadlessUiResolver,
    HeadlessUiResolverOptions,
    IduxResolver,
    IduxResolverOptions,
    InklineResolver,
    LayuiVueResolver,
    LayuiVueResolverOptions,
    NaiveUiResolver,
    PrimeVueResolver,
    PrimeVueResolverOptions,
    QuasarResolver,
    TDesignResolver,
    TDesignResolverOptions,
    VantResolver,
    VantResolverOptions,
    VarletUIResolver,
    VarletUIResolverOptions,
    VeuiResolver,
    VeuiResolverOptions,
    ViewUiResolver,
    VueUseComponentsResolver,
    Vuetify3Resolver,
    VuetifyResolver,
    getResolved,
} from 'unplugin-vue-components/resolvers';
/* eslint-enable no-unused-vars*/

export const configPluginUnpluginImport = ({ VITE_UNPLUGINS_IMPORTS }) => {
    const uis = VITE_UNPLUGINS_IMPORTS.split(',');
    const resolversMap = {
        AntDesign: () => [AntDesignVueResolver()],
        Arco: () => [ArcoResolver()],
        DevUi: () => [DevUiResolver()],
        ElementPlus: () => [ElementPlusResolver()],
        ElementUi: () => [ElementUiResolver()],
        HeadlessUi: () => [HeadlessUiResolver()],
        Idux: () => [IduxResolver()],
        Inkline: () => [InklineResolver()],
        LayuiVue: () => [LayuiVueResolver()],
        NaiveUi: () => [NaiveUiResolver()],
        PrimeVue: () => [PrimeVueResolver()],
        Quasar: () => [QuasarResolver()],
        TDesign: () => [TDesignResolver()],
        Vant: () => [VantResolver()],
        Varlet: () => [VarletUIResolver()],
        Veui: () => [VeuiResolver({})],
        VueUseComponents: () => [VueUseComponentsResolver()],
        Vuetify3: () => [Vuetify3Resolver()],
        Vuetify: () => [VuetifyResolver()],
    };
    const resolvers = uis.reduce((a, b) => a.concat(resolversMap[b]?.() || []), []);
    return [
        AutoImport({
            // https://github.com/antfu/unplugin-auto-import#configuration
            resolvers,
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/, // .md
            ],
            // global imports to register
            imports: [
                // presets // ???????????????????????????????????????API????????????????????????????????????????????????VueUse????????????????????????import????????????????????????????????????????????????????????????// eslint:vue-global-api
                'vue',
                'vue-router',
            ],
            eslintrc: {
                enabled: true,
            },
        }),
        Components({
            // https://github.com/antfu/unplugin-vue-components#configuration
            resolvers,
            dts: true, // ???????????? `components.d.ts` ??????
            dirs: ['src/components'], // ???????????????????????????????????????
            extensions: ['vue', 'tsx', 'jsx'], // ??????????????????????????????
            deep: true, // ???????????????
            directoryAsNamespace: false, // ????????????????????????????????????????????????
            globalNamespaces: [], // works when `directoryAsNamespace: true`
        }),
    ];
};

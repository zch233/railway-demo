<script setup>
import { computed } from 'vue';
import { useStoreSetting } from '@src/store/modules/setting';
import { useStorePermission } from '@src/store/modules/permission.js';
import Header from './components/Header.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import Sider from './components/Sider/index.vue';
import Setting from './Setting/index.vue';
import { GupoLayout, GupoLayoutContent } from '@src/components/UI';

const storeSetting = useStoreSetting();
const storePermission = useStorePermission();

const include = computed(() => {
    return storePermission.getKeepAliveList();
});
</script>

<template>
    <GupoLayout class="layout">
        <Header v-if="storeSetting.showHeader" />
        <GupoLayout>
            <Sider v-if="storeSetting.layoutType === 'left' && storeSetting.showMenu" />
            <GupoLayout>
                <Breadcrumb v-if="storeSetting.showBreadcrumb" />
                <div class="content-top" id="contentTop" />
                <GupoLayoutContent class="content">
                    <div class="main" id="main">
                        <RouterView>
                            <template #default="{ Component }">
                                <transition :name="storeSetting.animateType" mode="out-in">
                                    <KeepAlive :include="include">
                                        <component :is="Component" />
                                    </KeepAlive>
                                </transition>
                            </template>
                        </RouterView>
                    </div>
                </GupoLayoutContent>
            </GupoLayout>
        </GupoLayout>
        <Setting v-if="storeSetting.showSetting" />
    </GupoLayout>
</template>

<style lang="less" scoped>
.layout {
    width: 100%;
    height: 100vh;

    .content {
        overflow-x: hidden;
        overflow-y: auto;

        .main {
            position: relative;
            min-height: 100%;
            padding-bottom: 72px;
            background-color: #f0f2f5;

            > div:not(.footer) {
                width: 100%;
                min-height: 400px;
            }
        }
    }
}
</style>

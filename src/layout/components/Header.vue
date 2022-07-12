<template>
    <a-layout-header class="header box-shadow">
        <div class="header-left">
            <div class="header-left__logo">
                <img src="../../assets/logo.png" />
                <span>萧山</span>
            </div>
            <div class="header-left__text">标准后台模板</div>
        </div>
        <div class="header-right">
            <FullScreen />
            <NotifyBadge />
            <a-dropdown>
                <a-avatar :size="36">
                    <template #icon>
                        <img :src="userInfo.img || defaultAvatar" />
                    </template>
                </a-avatar>
                <template #overlay>
                    <div class="user-info box-shadow">
                        <div class="user-info-desc">
                            <a-avatar :size="36">
                                <template #icon>
                                    <img :src="userInfo.img || defaultAvatar" />
                                </template>
                            </a-avatar>
                            <div>{{ userInfo?.name || '—' }}<br />{{ userInfo?.phone || '—' }}</div>
                        </div>
                        <div class="user-info-menu">
                            <div>修改信息</div>
                            <div @click="logout">退出登录</div>
                        </div>
                    </div>
                </template>
            </a-dropdown>
        </div>
    </a-layout-header>
</template>

<script setup>
import { computed, createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import FullScreen from '@src/components/FullScreen/index.vue';
import NotifyBadge from '@src/components/NotifyBadge/index.vue';
import useUserStore from '@src/store/modules/user';
import defaultAvatar from '@src/assets/images/avatar.png';

const userInfo = computed(() => {
    const userStore = useUserStore();
    return userStore.userInfo;
});
const logout = () => {
    const userStore = useUserStore();
    Modal.confirm({
        title: '是否确认退出登录？',
        icon: createVNode(ExclamationCircleOutlined),
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk() {
            userStore.logout();
        },
    });
};
</script>

<style lang="less" scoped>
.header {
    width: 100%;
    padding: 0 10px;
    line-height: 1;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: width 0.3s ease;
    z-index: 99;
    &-left {
        display: flex;
        align-items: center;
        &__logo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 198px;
            img {
                width: 120px;
            }
            span {
                display: inline-block;
                padding: 3px 8px;
                margin-right: 15px;
                color: #fff;
                background: var(--ant-primary-color);
                border-radius: 2px;
            }
        }
        &__text {
            padding: 0 15px;
            font-size: 15px;
            border-left: 1px solid #d5d9de;
        }
    }
    &-right {
        display: flex;
        align-items: center;
        .full-screen,
        .notify-badge {
            margin-right: 20px;
        }
    }
}
.ant-avatar {
    background: #fff;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}
.user-info {
    width: 200px;
    border-radius: 5px;
    background: #fff;
    &-desc {
        display: flex;
        align-items: center;
        font-size: 15px;
        padding: 10px 15px;
        .ant-avatar {
            margin-right: 15px;
        }
    }
    &-menu {
        padding: 10px 0;
        border-top: 1px solid #ebeef5;
        > div {
            line-height: 2.5;
            padding: 0 15px;
            transition: all 0.3s ease;
            cursor: pointer;
            &:hover {
                color: var(--ant-primary-color);
                background-color: var(--ant-primary-1);
            }
        }
    }
}
</style>
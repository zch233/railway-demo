<script setup>
import { HomeFilled } from '@ant-design/icons-vue';

defineProps({
    modelValue: {
        required: true,
    },
    collapsed: {
        type: Boolean,
        default: true,
    },
    list: {
        type: Array,
        default: () => [],
    },
    labelKey: {
        type: String,
        default: 'name',
    },
    valueKey: {
        type: String,
        default: 'value',
    },
    theme: {
        type: String,
        default: 'light',
    },
});
defineEmits(['update:modelValue', 'onChange']);
</script>

<template>
    <div class="switch-org" :class="{ 'is-dark': theme === 'dark' }">
        <ATooltip placement="right">
            <template #title>铁路之家</template>
            <div class="switch-org__name iconWrapper">
                <HomeFilled />
                <div>铁路之家</div>
            </div>
        </ATooltip>
    </div>
</template>

<style lang="less" scoped>
.switch-org {
    padding: 0 18px 10px;
    overflow: hidden;
    transition: all 0.3s ease;

    &.is-dark {
        .switch-org__name {
            color: #fff;
        }
    }

    &__name {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        transition: color 0.3s ease;

        > div {
            margin-left: 10px;
            overflow: hidden;
            font-size: 17px;
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: opacity 0.3s ease;
        }

        &.iconWrapper :deep(.anticon.anticon-home) {
            font-size: 18px;
        }
    }

    &__change {
        display: flex;
        padding-left: 28px;
        overflow: hidden;
        font-size: 13px;
        color: var(--color-master);
        white-space: nowrap;
        cursor: pointer;
        transition: opacity 0.3s ease;
        align-items: center;

        &.ant-dropdown-trigger :deep(.anticon.anticon-swap) {
            margin-left: 6px;
            font-size: 14px;
        }
    }
}

.ant-layout-sider-collapsed .switch-org {
    height: 52px;
    padding: 0 calc(50% - 9px);
    line-height: 52px;

    &__name > div,
    &__change {
        text-align: center;
        opacity: 0;
    }
}
</style>

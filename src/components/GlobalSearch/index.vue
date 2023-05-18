<script name="GlobalSearch" setup>
import { GupoButton } from '@src/components/UI/index.js';
import { DownOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash-unified';
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch, h } from 'vue';
import GlobalFormItem from '@src/components/GlobalForm/Item.vue';
import { formItemProps } from '@src/components/GlobalForm/utils';

const props = defineProps({
    ...formItemProps,
    // 默认高度
    defaultHeight: {
        type: Number,
        default: 50, // 输入框高 + 上下padding：9px
    },
    // 默认是否展开
    defaultOpen: {
        type: Boolean,
        default: false,
    },
    defaultFormData: {
        type: Object,
    },
    // 配置项,支持类型:input, select, datePicker, datePicker.rangePicker, timePicker, timePicker.timeRangePicker, cascader, treeSelect
    itemConfigs: {
        type: Object,
        default: () => {
            return [];
        },
    },
    // 左侧label展示所占col
    labelCol: {
        type: Object,
        default: () => ({}),
    },
});
const emits = defineEmits(['reset', 'search', 'update:formData']);

let _defaultFormData = {};
const isOpen = ref(props.defaultOpen);
const $searchBox = ref();
const searchBoxHeight = ref('');

const _formData = reactive(
    // 初始化 formItem 每一项数据，默认值为 undefined
    props.itemConfigs.reduce((res, cur) => {
        res[cur.key] = undefined;
        return res;
    }, {})
);
const formDataValue = computed(() => props.formData || _formData);
const updateValue = data => {
    if (props.formData) {
        emits('update:formData', { ...props.formData, ...data });
    } else {
        Object.assign(_formData, data);
    }
};

const handleReset = () => {
    updateValue({
        ...props.itemConfigs.reduce((res, cur) => {
            res[cur.key] = undefined;
            return res;
        }, {}),
        ..._defaultFormData,
    });
    emits('reset');
};
const handleSearch = () => {
    emits('search', formDataValue.value);
};

watch(
    () => props.itemConfigs,
    () => {
        _defaultFormData = props.defaultFormData || cloneDeep(formDataValue.value);
        Object.assign(_formData, props.defaultFormData);
    },
    { immediate: true }
);

// 计算高度样式
const boxHeightStyle = computed(() => ({
    height: `${isOpen.value ? searchBoxHeight.value : props.defaultHeight}px`,
}));
// 是否换行了
const isLinefeed = computed(() => searchBoxHeight.value > props.defaultHeight);
// 是否有label
const isLabelMode = computed(() => props.itemConfigs.find(item => item.label));

// 设置 box 的高度
const setSearchBoxHeight = () => {
    searchBoxHeight.value = $searchBox.value?.offsetHeight;
};
watch([() => isOpen.value, () => props.itemConfigs], () => {
    nextTick(() => {
        setSearchBoxHeight();
    });
});
onMounted(() => {
    setSearchBoxHeight();
    window.addEventListener('resize', setSearchBoxHeight);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', setSearchBoxHeight);
});

defineExpose({ reset: () => updateValue(_defaultFormData) });
</script>

<template>
    <div class="global-search" :class="{ active: isLinefeed }">
        <div class="parent-search" :style="boxHeightStyle">
            <div :class="{ label: isLabelMode, 'search-box': true }" ref="$searchBox">
                <GlobalFormItem
                    v-for="(item, index) in itemConfigs"
                    :key="index"
                    v-bind="Object.keys(formItemProps).reduce((res, key) => Object.assign(res, { [key]: props[key] }), {})"
                    :item="item"
                    :label="item?.label"
                    :labelWrap="true"
                    :formData="formDataValue"
                    @update:formData="updateValue($event)"
                />
                <GlobalFormItem
                    :item="{
                        type: 'custom',
                        component: h('div', { class: 'empty-box' }, []),
                    }"
                />
            </div>
        </div>
        <div class="btn-box" :class="{ isOpen: isOpen, label: isLabelMode }">
            <GupoButton @click="handleReset">重置</GupoButton>
            <GupoButton type="primary" @click="handleSearch">查询</GupoButton>
            <span class="operation" @click="isOpen = !isOpen" v-if="isLinefeed">
                {{ isOpen ? '收起' : '展开' }}
                <DownOutlined :class="{ active: isOpen }" />
            </span>
        </div>
    </div>
</template>

<style lang="less" scoped>
.global-search {
    position: relative;
    display: flex;
    width: 100%;
    padding: calc(@globalSpace - 9px) calc(@globalSpace - 20px);
    margin-bottom: @space5;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 0 15px rgba(148, 161, 196, 0.25);
    justify-content: space-between;

    .parent-search {
        width: 100%;
        height: 100%;
        overflow: hidden;
        transition: all 0.3s ease;

        .search-box {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            :deep(.ant-select-selection-item-content) {
                max-width: 10em;
            }

            .ant-form-item {
                margin: 9px 20px;
                @media (min-width: 1024px) {
                    & {
                        width: calc(33.33% - 40px);
                    }
                }
                @media (min-width: 1440px) {
                    & {
                        width: calc(25% - 40px);

                        :deep(.ant-select-selection-item-content) {
                            max-width: 9em;
                        }
                    }
                }
                @media (min-width: 1920px) {
                    & {
                        width: calc(20% - 40px);
                    }
                }

                :deep(.ant-input),
                :deep(.ant-picker),
                :deep(.ant-select),
                .empty-box,
                :deep(.search-item) {
                    width: 100%;
                }
            }

            .empty-box {
                height: 32px;
            }

            &.label .ant-form-item {
                @media (min-width: 1024px) {
                    & {
                        width: calc(50% - 40px);
                    }
                }
                @media (min-width: 1440px) {
                    & {
                        width: calc(33.33% - 40px);
                    }
                }
                @media (min-width: 1920px) {
                    & {
                        width: calc(25% - 40px);
                    }
                }
            }
        }
    }

    .btn-box {
        position: absolute;
        right: @globalSpace;
        bottom: calc(@globalSpace - 9px);
        z-index: 2;
        display: flex;
        height: 32px;
        margin: 9px 0px;
        background-color: #fff;
        align-items: center;
        justify-content: flex-end;
        border-top: 1px solid #fff;
        border-bottom: 1px solid #fff;
        @media (min-width: 1024px) {
            & {
                width: calc(33.33% - 40px);
            }
        }
        @media (min-width: 1440px) {
            & {
                width: calc(25% - 40px);
            }
        }
        @media (min-width: 1920px) {
            & {
                width: calc(20% - 40px);
            }
        }

        .operation {
            margin-left: @space3;
            font-size: var(--font-size-content);
            color: var(--color-master);
            cursor: pointer;
            user-select: none;

            .anticon-down {
                margin-left: @space1;
                transform: rotate(0);
                transition: all 0.3s ease;

                &.active {
                    transform: rotate(180deg);
                }
            }
        }
    }

    .btn-box.label {
        @media (min-width: 1024px) {
            & {
                width: calc(50% - 40px);
            }
        }
        @media (min-width: 1440px) {
            & {
                width: calc(33.33% - 40px);
            }
        }
        @media (min-width: 1920px) {
            & {
                width: calc(25% - 40px);
            }
        }
    }
}
</style>

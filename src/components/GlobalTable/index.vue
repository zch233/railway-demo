<script name="GlobalTable" setup>
import { cloneDeep, isEmpty } from 'lodash-unified';
import { reactive, ref, computed, onMounted } from 'vue';
import { InfoCircleFilled } from '@ant-design/icons-vue';
import { GupoTable, GupoDivider } from '@src/components/UI/index.js';
import { tableOptionsProps } from '@src/components/GlobalTable/utils';
import GlobalTableOptions from '@src/components/GlobalTable/Options.vue';

const emits = defineEmits(['change', 'selectChange', 'selectedCancel']);
const props = defineProps({
    ...tableOptionsProps,
    isTopOperation: {
        type: Boolean,
        default: true,
    },
    tableTitle: {
        type: String,
        default: '',
    },
    listApi: {
        type: Function,
        require: true,
    },
    pageNames: {
        type: Object,
        default: () => ({ page: 'page', size: 'per_page' }),
    },
    pageData: {},
    // 接口返回参数
    listApiParamsName: {
        type: Object,
        default: () => ({ list: 'list', paginate: 'paginate', total: 'total' }),
    },
    /*
    排序的键名 
        sortField: 接口排序类型字段，（sortBy）
        sortOrder：排序筛选条件，可选值：ascend，descend （sort）
        defaultField: 默认排序的关键字名，
        defaultOrder：默认排序的条件；可选值：ascend，descend
    */
    sortNames: {
        type: Object,
        default: () => ({ sortField: '', sortOrder: '', defaultField: '', defaultOrder: '' }),
    },
    sortOrder: {
        type: Object,
        default: () => ({ ascend: 'asc', descend: 'desc' }),
    },
    // 分页的所有配置项
    pagination: {
        type: [Object, Boolean],
        default: () => ({}),
    },
    rowSelection: {
        type: [Object, Boolean],
        default: () => false,
    },
    // 隐藏整个选择展示区域
    hiddenRowSelectionArea: {
        type: Boolean,
        default: false,
    },
    // 隐藏'取消选择'
    hiddenCancelSelected: {
        type: Boolean,
        default: false,
    },
    // 下面的都是插槽是否显示，默认显示会出现显示问题，只有使用时再显示
    expandedRowRender: {
        type: Boolean,
        default: false,
    },
    customFilterIcon: {
        type: Boolean,
        default: false,
    },
    title: {
        type: Boolean,
        default: false,
    },
    footer: {
        type: Boolean,
        default: false,
    },
    emptyText: {
        type: Boolean,
        default: false,
    },
    summary: {
        type: Boolean,
        default: false,
    },
    customFilterDropdown: {
        type: Boolean,
        default: false,
    },
    operationRender: {
        type: [Object, Function],
    },
});
const route = useRoute();
const $globalTable = ref();
const $globalTableOptions = ref();

const defaultMeta = {
    current_page: 1,
    per_page: props?.pagination?.defaultPageSize || 2,
};
let meta = reactive({ ...defaultMeta });

onMounted(() => {
    getList();
});

const change = (data, filters, sorter) => {
    const { current, pageSize } = data;
    meta.current_page = current;
    meta.per_page = pageSize;
    getList(sorter, filters);
    emits('change', { data, filters, sorter });
};

// 刷新 传参: 不恢复到默认页码;
const refresh = noRevertDefaultPage => {
    if (!noRevertDefaultPage) {
        const { current_page } = defaultMeta;
        meta.current_page = current_page;
    } else if (tableData.dataSource.length === 1 && meta.current_page > 1) {
        // 当删除只有最后一条数据时，并且不是最后一页，页码 -1
        meta.current_page -= 1;
    }
    getList();
};

// 设置
const _columns = ref(cloneDeep(props.columns));
watch(
    () => props.columns,
    () => {
        _columns.value = cloneDeep(props.columns);
    }
);
const defineColumns = computed(() =>
    _columns.value.map(item => {
        return {
            ...item,
            // 兼容部分人只想传 key 的情况
            dataIndex: item?.dataIndex || item.key,
            customRender:
                item.customRender ||
                (({ text: val, record: row }) => {
                    //当前单元格值 是否为 空 值
                    //判断值若为 空 则返回 '-'
                    //否则判断值若 自定义格式化 则返回自己的 setValue() 方法的返回值
                    //否则返回 prop
                    const isEmptyValue = typeof val === 'object' ? isEmpty(val) : val === '';
                    return isEmptyValue ? '—' : item.setValue ? item.setValue(val, row) : val;
                }),
        };
    })
);
const updateDefineColumns = val => {
    _columns.value = val;
};

// 反选框
const selectedData = reactive({
    rowKeys: [],
    loading: false,
});

const selectedChange = selectedRowKeys => {
    selectedData.rowKeys = selectedRowKeys;
    emits('selectChange', selectedRowKeys);
};
const hasSelected = computed(() => formatRowSelection.value?.selectedRowKeys.length > 0 && !props.hiddenRowSelectionArea);

// 取消选择
const selectedCancel = () => {
    selectedData.rowKeys = [];
    emits('selectChange', []);
    emits('selectedCancel');
};

const tableData = reactive({
    dataSource: [],
    total: 0,
    loading: false,
});

// 获取接口数据
const getList = async (sorter, filters) => {
    const sorters = sorter || {
        field: props.sortNames.defaultField,
        order: props.sortNames.defaultOrder,
    };
    tableData.loading = true;
    const result = await props
        .listApi({
            [props.pageNames.page]: meta.current_page,
            [props.pageNames.size]: meta.per_page,
            ...(props.sortNames.sortField && { [props.sortNames.sortField]: sorters.field, [props.sortNames.sortOrder]: props.sortOrder[sorters.order] }),
            ...filters,
        })
        .finally(() => {
            tableData.loading = false;
        });
    const { data } = result;
    // 如果源数据没有 'key'（rowKey 的默认值） 就加上
    tableData.dataSource = data[props.listApiParamsName.list].map((v, i) => ({ key: i, ...v }));
    tableData.total = data?.[props.listApiParamsName.paginate]?.[props.listApiParamsName.total];
};

const formatPagination = computed(() => {
    return props.pagination
        ? {
              total: tableData.total,
              current: meta.current_page,
              defaultPageSize: meta.per_page,
              showTotal: total => `总计${total}条`,
              'show-quick-jumper': true,
              ...props.pagination,
              pageSizeOptions: ['10', '20', '50', '100', '9999'],
          }
        : props.pagination;
});

const formatRowSelection = computed(() => {
    return props.rowSelection
        ? {
              selectedRowKeys: selectedData.rowKeys,
              onChange: selectedChange,
              ...props.rowSelection,
          }
        : undefined;
});

// 筛选选中的数据
const selectedDataSource = computed(() => tableData.dataSource.filter(item => formatRowSelection.value?.selectedRowKeys.includes(item[props.rowKey])));

defineExpose({ refresh, selectedDataSource, selectedChange });
</script>

<template>
    <div class="global-table" ref="$globalTable">
        <div class="top-area" v-if="isTopOperation">
            <div class="left">{{ tableTitle || `${route.meta.title || ''}列表` }}</div>
            <div class="right">
                <slot name="operation">
                    <component :is="props.operationRender" />
                </slot>
                <GupoDivider type="vertical" v-if="operation.length" />
                <GlobalTableOptions
                    v-bind="Object.keys(tableOptionsProps).reduce((res, key) => Object.assign(res, { [key]: props[key] }), {})"
                    ref="$globalTableOptions"
                    :fullscreenEl="fullscreenEl || $globalTable"
                    @setDefineColumns="updateDefineColumns($event)"
                    @refresh="refresh(true)"
                />
            </div>
        </div>
        <!-- 选择区域 -->
        <div class="selected" v-show="hasSelected">
            <div class="selected-left">
                <InfoCircleFilled />
                <span class="selected-num">
                    已选择 <span class="global-master-color">{{ formatRowSelection?.selectedRowKeys?.length }}</span> 项
                </span>
                <span class="tip"> <slot name="selected-tip" /> </span>
            </div>
            <div class="selected-right">
                <span v-if="!hiddenCancelSelected" class="global-master-color" @click="selectedCancel">取消选择</span>
                <!-- selectedCancel: 取消选择； item：选中行-->
                <slot name="selected-operation" :selectedCancel="selectedCancel" :item="selectedDataSource" />
            </div>
        </div>
        <!-- 表格区域-->
        <div id="global-table">
            <GupoTable
                v-bind="$attrs"
                :row-selection="formatRowSelection"
                :dataSource="tableData.dataSource"
                :columns="defineColumns"
                :pagination="formatPagination"
                @change="change"
                :size="$globalTableOptions?.density"
                :loading="tableData.loading"
                v-show="$globalTableOptions?.hasColumns"
            >
                <template #headerCell="{ title, column }">
                    <slot name="headerCell" :column="column" :title="title" />
                </template>
                <template #bodyCell="{ text, record, index, column }">
                    <slot name="bodyCell" :column="column" :text="text" :index="index" :record="record" />
                </template>
                <template #title v-if="title">
                    <slot name="title" />
                </template>
                <template #footer v-if="footer">
                    <slot name="footer" />
                </template>
                <template #summary v-if="summary">
                    <slot name="summary" />
                </template>
                <template #emptyText v-if="emptyText">
                    <slot name="emptyText" />
                </template>
                <template #expandedRowRender v-if="expandedRowRender">
                    <slot name="expandedRowRender" />
                </template>
                <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" v-if="customFilterDropdown">
                    <slot
                        name="customFilterDropdown"
                        :setSelectedKeys="setSelectedKeys"
                        :selectedKeys="selectedKeys"
                        :confirm="confirm"
                        :clearFilters="clearFilters"
                        :column="column"
                    />
                </template>
                <template #customFilterIcon="{ filtered, column }" v-if="customFilterIcon">
                    <slot name="customFilterIcon" :filtered="filtered" :column="column" />
                </template>
            </GupoTable>
        </div>
    </div>
</template>

<style lang="less" scoped>
.global-table {
    padding: @space4 @space8 @space2;
    background-color: #fff;
    box-shadow: 0 0 15px rgba(148, 161, 196, 0.25);

    .top-area {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: @space4;

        .left {
            font-size: 16px;
        }
    }

    .selected {
        display: flex;
        padding: @space3 @space4;
        margin-bottom: @space4;
        font-size: var(--font-size-content);
        background-color: var(--color-master-light-4);
        border: 1px solid var(--color-master-light-3);
        justify-content: space-between;
        align-items: center;

        .selected-left {
            .anticon-info-circle {
                margin-right: @space2;
                color: var(--color-master);
            }

            span.global-master-color {
                font-weight: bold;
            }

            .tip {
                margin-left: @space5;
            }
        }

        .selected-right {
            display: flex;

            span {
                margin-left: @space5;
                cursor: pointer;
            }
        }
    }

    #global-table {
        background-color: #fff;
    }

    :deep(.ant-table) {
        .ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan]):before {
            display: none;
        }
    }
}
</style>

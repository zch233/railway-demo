import { GupoButton, GupoTag, gupoMessage, GupoDropdownButton, GupoMenu, GupoMenuItem, GupoModal } from '@src/components/UI';
import { useLocalStorage } from '@src/utils/storage';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import { getStatus, beginCars } from '@src/views/List/utils';
import GlobalIcon from '@src/components/GlobalIcon';
import GlobalTable from '@src/components/GlobalTable/index.vue';
import GlobalSearch from '@src/components/GlobalSearch/index.vue';
import { CloudUploadOutlined } from '@ant-design/icons-vue';

const initFormData = () => ({
    time: dayjs().add(1, 'day').format('YYYY-MM-DD'),
});

export const useTable = options => {
    const $globalTable = ref();
    const filterOptions = reactive(initFormData());
    const itemConfigs = computed(() => [
        {
            key: 'time',
            type: 'datePicker',
            props: {
                valueFormat: 'YYYY-MM-DD',
                placeholder: '请选择日期',
                allowClear: false,
                disabled: options?.exterior,
            },
        },
        {
            key: '1',
            type: 'select',
            props: {
                placeholder: '请选择办客站',
                showSearch: true,
                options: places.value.map(value => ({ label: value, value })),
            },
        },
        {
            key: '2',
            type: 'input',
            props: {
                placeholder: '请输入车次',
            },
        },
        {
            key: '6',
            type: 'select',
            props: {
                placeholder: '请选择站台',
                showSearch: true,
                options: platforms.value.map(value => ({ label: value, value })),
            },
        },
        {
            key: '7',
            type: 'select',
            props: {
                placeholder: '请选择线路',
                showSearch: true,
                options: ways.value.map(value => ({ label: value, value })),
            },
        },
        {
            key: 'custom_status',
            type: 'select',
            props: {
                placeholder: '请选择状态',
                showSearch: true,
                options: [
                    { value: '1', label: '正常' },
                    { value: '0', label: '停运' },
                ],
            },
        },
        {
            key: 'custom_begin',
            type: 'select',
            props: {
                placeholder: '请选择是否始发车',
                showSearch: true,
                options: [
                    { value: '1', label: '是' },
                    { value: '0', label: '否' },
                ],
            },
        },
        {
            key: 'custom_temp',
            type: 'select',
            props: {
                placeholder: '请选择是否始临客',
                showSearch: true,
                options: [
                    { value: '1', label: '是' },
                    { value: '0', label: '否' },
                ],
            },
        },
    ]);
    const places = useLocalStorage('places', []);
    const platforms = useLocalStorage('platforms', []);
    const ways = useLocalStorage('ways', []);
    const columns = useLocalStorage('columns', []);
    const dataSource = useLocalStorage('dataSource', { list: [], total: 0 });
    const dataSourceTemp = useLocalStorage('dataSourceTemp', { list: [], total: 0 });

    const filterDataSource = ref();
    const selectedRowKeys = ref([]);
    const Table = props => {
        const dataSourceTotal = computed(() => {
            const list = props.tableData
                ? props.tableData
                : dataSourceTemp.value.list
                      .filter(v => dayjs(filterOptions.time).isBetween(dayjs(v.dateRange[0]).add(-1, 'day'), dayjs(v.dateRange[1]).add(1, 'day')))
                      .concat(dataSource.value.list);
            return {
                list,
                total: list.length,
            };
        });
        return (
            <section className='listTable'>
                <GlobalSearch
                    defaultFormData={initFormData()}
                    itemConfigs={itemConfigs.value}
                    onSearch={e => {
                        Object.assign(filterOptions, e);
                        let list = dataSourceTotal.value.list;
                        // 筛选办客站
                        if (e[1]) {
                            list = list.filter(v => v[1] === e[1]);
                        }
                        // 筛选线路
                        if (e[7]) {
                            list = list.filter(v => v[7] === e[7]);
                        }
                        // 筛选站台
                        if (e[6]) {
                            list = list.filter(v => v[6] === e[6]);
                        }
                        // 筛选车次
                        if (e[2]) {
                            list = list.filter(v => v[2].includes(e[2]));
                        }
                        // 筛选状态
                        if (e['custom_status']) {
                            list = list.filter(v => getStatus(v, e.time) === (e['custom_status'] === '1'));
                        }
                        // 筛选始发车
                        if (e['custom_begin']) {
                            list = list.filter(v =>
                                e['custom_begin'] === '1' ? beginCars.includes(v[3].split('-')[0]) : !beginCars.includes(v[3].split('-')[0])
                            );
                        }
                        if (e['custom_temp']) {
                            list = list.filter(v => v[0].toString().includes('-'));
                        }
                        filterDataSource.value = {
                            list,
                            total: list.length,
                        };
                        $globalTable.value.refresh();
                    }}
                />
                <GlobalTable
                    rowKey='0'
                    rowSelection={{ selectedRowKeys: selectedRowKeys.value, onChange: e => (selectedRowKeys.value = e) }}
                    onSelectedCancel={() => (selectedRowKeys.value = [])}
                    ref={$globalTable}
                    columns={columns.value
                        .map(v => ({
                            ...v,
                            customRender: ({ text }) =>
                                v.key === 0 && text.toString()?.includes('-') ? (
                                    <span
                                        style='text-decoration: underline;cursor: pointer;'
                                        onClick={() => {
                                            GupoModal.confirm({
                                                title: '提示',
                                                content: '确认要删除吗？',
                                                onOk: () => {
                                                    const list = dataSourceTemp.value.list.filter(v => v[0] !== text);
                                                    dataSourceTemp.value = {
                                                        list,
                                                        total: list.length,
                                                    };
                                                    $globalTable.value.refresh();
                                                },
                                            });
                                        }}
                                    >
                                        {dayjs(Number(text.split('-')[0])).format('YYYY-MM-DD HH:mm:ss')}-{text.split('-')[1]}
                                    </span>
                                ) : (
                                    text
                                ),
                        }))
                        .concat([
                            {
                                key: 'custom_status',
                                title: '状态',
                                customRender: ({ record }) => {
                                    return getStatus(record, filterOptions.time) ? <GupoTag color='green'>正常</GupoTag> : <GupoTag color='red'>停运</GupoTag>;
                                },
                            },
                            {
                                key: 'custom_begin',
                                title: '始发车',
                                customRender: ({ record }) => {
                                    return beginCars.includes(record[3].split('-')[0]) ? (
                                        <GlobalIcon style='font-size: 20px;color:#389e0d;' name='begin' />
                                    ) : (
                                        '-'
                                    );
                                },
                            },
                        ])}
                    listApi={async () => ({ data: filterDataSource.value || dataSourceTotal.value })}
                    operationRender={() =>
                        options?.exterior ? null : (
                            <>
                                <GupoDropdownButton onClick={() => props.onImport?.()} style='margin-right: 8px;'>
                                    {{
                                        default: () => '导入',
                                        overlay: () => (
                                            <GupoMenu>
                                                {[{ key: 'temp', text: '临客', click: () => props.onImportTemp?.() }].map(item => (
                                                    <GupoMenuItem key={item.key} onClick={item.click}>
                                                        <CloudUploadOutlined />
                                                        <span> {item.text}</span>
                                                    </GupoMenuItem>
                                                ))}
                                            </GupoMenu>
                                        ),
                                    }}
                                </GupoDropdownButton>
                                <GupoButton
                                    type='primary'
                                    onClick={() => {
                                        const data = filterDataSource.value || dataSourceTotal.value;
                                        if (data.list.length === 0) {
                                            gupoMessage.error('无效数据');
                                            return;
                                        }
                                        props.onExport?.({
                                            data,
                                            filterOptions,
                                        });
                                    }}
                                >
                                    查看当日统计
                                </GupoButton>
                                <GupoButton
                                    type='primary'
                                    disabled={selectedRowKeys.value.length === 0}
                                    onClick={() => props.onOrder?.({ list: selectedRowKeys.value })}
                                >
                                    添加调令
                                </GupoButton>
                            </>
                        )
                    }
                />
            </section>
        );
    };
    return {
        Table,
        setColumns: e => (columns.value = e),
        setDataSource: e => (dataSource.value = e),
        setPlaces: e => (places.value = e),
        setPlatforms: e => (platforms.value = e),
        setWays: e => (ways.value = e),
        setDataSourceTemp: e => (dataSourceTemp.value = e),
        setSelectedRowKeys: e => (selectedRowKeys.value = e),
        refreshTable: () => $globalTable.value?.refresh(),
        dataSourceTemp,
    };
};

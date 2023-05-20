<script lang="jsx">
import { gupoMessage, GupoModal, GupoButton, GupoAlert, GupoDivider } from '@src/components/UI';
import GupoCharts from '@src/components/GupoCharts/index.vue';
import { workbook2blob } from '@src/views/OrderList/utils';
import { getStatus, timeSlot, beginCars } from '@src/views/List/utils';
import GlobalFormItem from '@src/components/GlobalForm/Item.vue';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import ModalExportTable from '@src/views/List/ModalExportTable.vue';
dayjs.extend(isBetween);

export default defineComponent({
    name: 'ModalExport',
    expose: ['showModal'],
    setup() {
        const $modalExportTable = ref();
        const modal = reactive({
            visible: false,
            loading: false,
        });
        const formData = ref({ timeStep: 60 });
        const params = ref({});
        const chartDataOption = ref({});
        const dataMap = ref({
            normal: {},
            abnormal: {},
        });
        const setChartDataOption = () => {
            dataMap.value = {
                normal: {},
                abnormal: {},
            };
            const dateArr = timeSlot(formData.value.timeStep).slice(1).concat('24:00');
            params.value.data?.list.map(v => {
                for (let i = 0; i < dateArr.length; i++) {
                    const section = [dateArr[i - 1] || '00:00', dateArr[i]];
                    dataMap.value.normal[section.join('-')] = dataMap.value.normal[section.join('-')] || [];
                    dataMap.value.abnormal[section.join('-')] = dataMap.value.abnormal[section.join('-')] || [];
                    if (
                        dayjs(`${params.value.filterOptions?.time} ${v[4] === '=' ? v[5] : v[4]}`).isBetween(
                            dayjs(`${params.value.filterOptions?.time} ${section[0]}`).add(-1, 'second'),
                            dayjs(`${params.value.filterOptions?.time} ${section[1]}`)
                        )
                    ) {
                        const status = getStatus(v, params.value.filterOptions?.time);
                        v.typeDefinition = status ? '正常' : '停运';
                        dataMap.value[status ? 'normal' : 'abnormal'][section.join('-')].push(v);
                    }
                    v.beginDefinition = beginCars.includes(v[3].split('-')[0]) ? '是' : '否';
                }
            });
            console.log(dataMap.value);
            chartDataOption.value = {
                height: 550,
                colors: ['#91cc75', '#ee6666'],
                option: {
                    toolbox: {
                        feature: {
                            saveAsImage: {
                                show: true,
                                title: '保存图片',
                            },
                        },
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            // Use axis to trigger tooltip
                            type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
                        },
                    },
                    legend: {
                        left: 'center',
                        bottom: '2%',
                    },
                    title: {
                        top: '2%',
                        left: 'center',
                        text: `${dayjs(params.value.filterOptions?.time).format('YYYY年MM月DD日')}${
                            params.value.filterOptions?.[1] ? `${params.value.filterOptions?.[1]}站` : ''
                        }${params.value.filterOptions?.[6] ? `${params.value.filterOptions?.[6]}站台` : ''}${
                            params.value.filterOptions?.[7] ? `${params.value.filterOptions?.[7]}线` : ''
                        }运行图${params.value.filterOptions?.custom_begin === '1' ? '（始发车）' : ''}${
                            params.value.filterOptions.custom_temp === '1' ? '（临客）' : ''
                        }`,
                    },
                    xAxis: {
                        type: 'category',
                        data: dateArr,
                    },
                    yAxis: {
                        type: 'value',
                    },
                    grid: {
                        left: '1%',
                        right: '1%',
                        bottom: '9%',
                        top: '10%',
                        containLabel: true,
                    },
                    series: [
                        {
                            name: '正常',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true,
                                formatter: val => (val.value === 0 ? '' : val.value),
                            },
                            emphasis: {
                                focus: 'series',
                            },
                            data: Object.values(dataMap.value.normal).map(v => v.length),
                        },
                        {
                            name: '停运',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true,
                                formatter: val => (val.value === 0 ? '' : val.value),
                            },
                            emphasis: {
                                focus: 'series',
                            },
                            data: Object.values(dataMap.value.abnormal).map(v => v.length),
                        },
                        {
                            name: '正常-折线',
                            type: 'line',
                            smooth: true,
                            label: {
                                show: true,
                                formatter: val => (val.value === 0 ? '' : val.value),
                            },
                            emphasis: {
                                focus: 'series',
                            },
                            data: Object.values(dataMap.value.normal).map(v => v.length),
                        },
                    ],
                },
            };
        };
        const showModal = data => {
            modal.visible = true;
            params.value = data;
            setChartDataOption();
        };
        const Modal = () => (
            <GupoModal
                width='1800px'
                visible={modal.visible}
                onUpdate:value={e => (modal.visible = e)}
                onOk={() => (modal.visible = false)}
                onCancel={() => (modal.visible = false)}
                confirmLoading={modal.loading}
                title={`今日统计(${params.value.filterOptions?.time})`}
            >
                <GupoAlert
                    message={`实际开行 ${params.value.data?.list.length} 趟。其中，固定列车开行 ${Object.values(dataMap.value.normal)
                        .map(v => v.filter(v => !v.dateRange))
                        .map(v => v.length)
                        .reduce((a, b) => a + b, 0)} 趟（停运 ${Object.values(dataMap.value.abnormal)
                        .map(v => v.filter(v => !v.dateRange))
                        .map(v => v.length)
                        .reduce((a, b) => a + b, 0)} 趟），临客开行 ${Object.values(dataMap.value.normal)
                        .map(v => v.filter(v => v.dateRange))
                        .map(v => v.length)
                        .reduce((a, b) => a + b, 0)} 趟（停运 ${Object.values(dataMap.value.abnormal)
                        .map(v => v.filter(v => v.dateRange))
                        .map(v => v.length)
                        .reduce((a, b) => a + b, 0)} 趟）`}
                    type='warning'
                    show-icon
                />
                <GupoDivider />
                <GlobalFormItem
                    labelCol={{ span: 0 }}
                    formData={formData.value}
                    onUpdate:formData={e => {
                        formData.value = e;
                        setChartDataOption();
                    }}
                    item={{
                        key: 'timeStep',
                        label: '间隔时长',
                        type: 'select',
                        props: {
                            options: [15, 30, 60, 120, 180].map(value => ({ label: `${value}分钟`, value })),
                        },
                    }}
                />
                <GupoCharts
                    {...chartDataOption.value}
                    onChartClick={e => {
                        const normal = Object.values(dataMap.value.normal)[e.dataIndex];
                        const abnormal = Object.values(dataMap.value.abnormal)[e.dataIndex];
                        $modalExportTable.value.showModal(normal.concat(abnormal));
                    }}
                />
                <GupoButton
                    type='primary'
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(
                            workbook2blob(
                                params.value.data?.list.map(v => ({
                                    序号: v[0],
                                    办客站: v[1],
                                    车次: v[2],
                                    区间: v[3],
                                    到点: v[4],
                                    开点: v[5],
                                    站台: v[6],
                                    线路: v[7],
                                    状态: v.typeDefinition,
                                    始发车: v.beginDefinition,
                                }))
                            )
                        );
                        link.download = `车次表(${params.value.filterOptions?.time})${dayjs().format('YYYY-MM-DD HH-mm-ss')}.xlsx`;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        gupoMessage.success('导出成功');
                    }}
                >
                    导出
                </GupoButton>
                <ModalExportTable ref={$modalExportTable} />
            </GupoModal>
        );
        return {
            Modal,
            showModal,
        };
    },
    render() {
        return this.Modal();
    },
});
</script>

<template>
    <div
        class="gupo-charts"
        :style="{
            width: typeof width === 'string' ? width : width + 'px',
            height: typeof height === 'string' ? height : height + 'px',
        }"
    >
        <div ref="$eChart" :style="{ width: '100%', height: '100%' }" />
    </div>
</template>

<script setup name="Chart">
import echarts from '@src/utils/echarts';
import { unref } from 'vue';
import { merge } from 'lodash-unified';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
    width: {
        type: [String, Number],
        default: '100%',
    },
    height: {
        type: [String, Number],
        default: '100%',
    },
    title: {
        type: String,
        default: '',
    },
    unit: {
        type: String,
        default: '',
    },
    isAxial: {
        type: Boolean,
        default: false,
    },
    isXAxisLine: {
        type: Boolean,
        default: true,
    },
    isYAxisLine: {
        type: Boolean,
        default: false,
    },
    colors: {
        type: Array,
        default: () => ['#006FFF', '#08DAAA', '#FF8300', '#F93939', '#9E0CF1', '#00C0FC', '#93E869', '#F6CD2B'],
    },
    loading: {
        type: Boolean,
        default: true,
    },
    isZoom: {
        type: Boolean,
        default: false,
    },
    dataset: {
        type: Object,
        default: () => {
            return {
                dimensions: [],
                source: [],
            };
        },
    },
    series: {
        type: Array,
        default: () => {
            return [];
        },
    },
    option: {
        type: Object,
        default: () => {
            return {};
        },
    },
    notMerge: {
        type: Boolean,
        default: false,
    },
    onChartClick: Function,
});

/**
 * data
 */
let myChart = null;
const $eChart = ref();

/**
 * methods
 */
const dataZoom = computed(() =>
    props.isZoom
        ? [
              {
                  start: 0, //默认为0
                  end: 100, //默认为100
                  type: 'slider',
                  maxValueSpan: 4, //显示数据的条数(默认显示10个)
                  minValueSpan: 4,
                  show: true,
                  yAxisIndex: 0,
                  realtime: true,
                  zoomLock: true,
                  height: '88%', //组件高度
                  left: 600, //左边的距离
                  right: 8, //右边的距离
                  top: 0, //上边边的距离
                  borderColor: 'rgba(43,48,67,0.4)',
                  zoomOnMouseWheel: false,
                  moveOnMouseMove: false,
                  fillerColor: '#4D5CA6',
                  backgroundColor: 'rgba(13,33,117,0.5)', //两边未选中的滑动条区域的颜色
                  showDataShadow: false, //是否显示数据阴影 默认auto
                  showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
              },
              //滑块的属性
              {
                  type: 'inside',
                  id: 'insideY',
                  yAxisIndex: 0,
                  show: true,
                  start: 0,
                  end: 40,
                  maxValueSpan: 4,
                  zoomOnMouseWheel: false,
                  moveOnMouseMove: false,
                  moveOnMouseWheel: false,
              },
          ]
        : []
);
const lineOption = computed(() => {
    return {
        dataset: props.dataset,
        color: props.colors,
        title: {
            text: props.title,
        },
        xAxis: {
            type: props.isAxial ? 'value' : 'category',
            name: props.isAxial ? props.unit : '',
            axisLine: {
                show: props.isXAxisLine,
                lineStyle: {
                    color: '#d9d9d7',
                    width: 1,
                },
            },
            splitLine: {
                lineStyle: {
                    color: '#d9d9d7',
                },
            },
            axisTick: {
                show: true,
                alignWithLabel: true,
            },
            axisLabel: {
                show: true,
                color: '#5b5b5d',
                fontSize: 12,
            },
        },
        yAxis: {
            type: props.isAxial ? 'category' : 'value',
            name: props.isAxial ? '' : props.unit,
            splitLine: {
                lineStyle: {
                    color: '#e5e5e5',
                    type: 'dashed',
                },
            },
            axisLine: {
                show: props.isYAxisLine,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: true,
                color: '#5b5b5d',
                fontSize: 12,
            },
        },
        dataZoom: dataZoom.value,
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            icon: 'roundRect',
            textStyle: {
                color: '#606266',
            },
        },
        grid: {
            top: '50',
            bottom: '0',
            right: '5',
            left: '5',
            containLabel: true,
        },
        series: props.series,
    };
});
const defaultOption = computed(() => lineOption.value);

/**
 * watch
 */
watch(
    [() => props.dataset, () => props.option],
    () => {
        defaultOption.value && myChart.setOption(unref(merge(defaultOption, props.option)), props.notMerge);
        defaultOption.value && myChart.setOption(props.option);
    },
    {
        deep: true,
    }
);

/**
 * methods
 */
const getChart = () => {
    myChart = echarts.init($eChart.value);
    // 使用 notMerge 的形式可以移除坐标轴
    myChart.setOption(merge(defaultOption.value, props.option), props.notMerge);
};
const resize = () => {
    myChart.resize(); // 窗口大小发生变化的时候重置
};

/**
 * onMounted
 */
onMounted(() => {
    const timer = setTimeout(() => {
        getChart();
        clearTimeout(timer);
    });
    setTimeout(() => {
        props.onChartClick && myChart.on('click', params => props.onChartClick(params));
    });

    window.addEventListener('resize', resize); // 添加监听
});

/**
 * onBeforeUnmount
 */
onBeforeUnmount(() => window.removeEventListener('resize', resize));
</script>

<style scoped lang="less"></style>

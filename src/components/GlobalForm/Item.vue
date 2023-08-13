<script setup name="GlobalFormItem">
import {
    GupoButton,
    GupoCascader,
    GupoCheckbox,
    GupoDatePicker,
    GupoForm,
    GupoImage,
    GupoInput,
    GupoInputNumber,
    GupoRadio,
    GupoRate,
    GupoSelect,
    GupoSlider,
    GupoSwitch,
    GupoTimePicker,
    GupoTreeSelect,
    GupoUpload,
} from '@src/components/UI';
import { formItemEmits, formItemProps } from '@src/components/GlobalForm/utils';
import { computed, ref } from 'vue';

const GupoFormItem = GupoForm.Item;

const props = defineProps({
    ...formItemProps,
    item: {
        type: Object,
        default: () => ({}),
    },
    formData: {
        type: Object,
        default: () => ({}),
    },
});

const emits = defineEmits([...formItemEmits]);

const normalComponents = {
    input: GupoInput,
    'input.password': GupoInput.Password,
    'input.textarea': GupoInput.TextArea,
    inputNumber: GupoInputNumber,
    datePicker: GupoDatePicker,
    'datePicker.rangePicker': GupoDatePicker.RangePicker,
    timePicker: GupoTimePicker,
    'timePicker.timeRangePicker': GupoTimePicker.TimeRangePicker,
    rate: GupoRate,
    slider: GupoSlider,
    treeSelect: GupoTreeSelect,
    checkbox: GupoCheckbox.Group,
    radio: GupoRadio.Group,
    cascader: GupoCascader,
};

const compositeComponents = {
    select: GupoSelect,
    switch: GupoSwitch,
    upload: GupoUpload,
    'upload.dragger': GupoUpload.Dragger,
};

// 操作按钮区域 wrapperCol
const formatterOperationWrapperCol = computed(() =>
    Object.values(props.operationWrapperCol).length ? props.operationWrapperCol : { offset: props.labelCol.span, span: props.wrapperCol.span }
);

const updateValue = (value, item) => {
    emits('update:formData', value);
    item.props?.dataChange?.(value);
};

// 定义单独配置
const generateProps = item => {
    const formatLabel = typeof item.label === 'string' ? item.label : '';
    // 部分特殊的组件需要提前加一些额外的配置
    const componentMap = {
        input: {
            placeholder: '请输入' + formatLabel,
        },
        inputNumber: {
            placeholder: '请输入' + formatLabel,
        },
        'input.password': {
            placeholder: '请输入' + formatLabel,
            autocomplete: 'off',
        },
        'input.textarea': {
            placeholder: '请输入' + formatLabel,
        },
        treeSelect: {
            placeholder: '请选择' + formatLabel,
        },
        select: {
            placeholder: '请选择' + formatLabel,
            filterOption: selectFilterOption,
        },
        cascader: {
            placeholder: '请选择' + formatLabel,
            showSearch: item?.props?.showSearch ? cascaderFilterOption : false,
        },
    };
    return {
        ...componentMap[item.type],
        ...item?.props,
    };
};

// select筛选选项
const selectFilterOption = (input, option) => {
    return Object.values(option).join().toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
//cascader筛选
const cascaderFilterOption = (inputValue, path) => {
    return path.some(option => Object.values(option).join().toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};

// 图片预览
const previewVisible = ref(false);
const previewImage = ref('');
const handlePreview = async file => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    setVisible(true);
};
const getBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};
const setVisible = value => {
    previewVisible.value = value;
};
</script>

<template>
    <GupoFormItem
        :name="item.key"
        :wrapper-col="item.type === 'operation' || !item.label ? formatterOperationWrapperCol : { ...wrapperCol }"
        :label="item?.label"
        v-bind="item?.formItemProps"
    >
        <!-- 下面定义的component类型 -->
        <template v-if="Object.keys(normalComponents).includes(item.type)">
            <component
                :is="normalComponents[item.type]"
                :value="formData[item.key]"
                @update:value="updateValue({ [item.key]: $event }, item)"
                :allowClear="allowClear"
                v-bind="generateProps(item) || {}"
            />
        </template>
        <!-- select -->
        <template v-else-if="item.type === 'select'">
            <component
                :is="compositeComponents.select"
                :value="formData[item.key]"
                @update:value="updateValue({ [item.key]: $event }, item)"
                :allowClear="allowClear"
                v-bind="generateProps(item) || {}"
                ><template #option="option" v-if="item?.props?.option">
                    <slot name="option" :option="option" :data="formData">
                        <component :is="item?.props?.option?.(option)" />
                    </slot> </template
            ></component>
        </template>
        <!-- switch -->
        <template v-else-if="item.type === 'switch'">
            <component
                :is="compositeComponents.switch"
                :checked="formData[item.key]"
                @update:checked="updateValue({ [item.key]: $event }, item)"
                v-bind="item?.props || {}"
            />
        </template>
        <template v-else-if="item.type === 'upload'">
            <component
                :is="compositeComponents.upload"
                :file-list="formData[item.key]"
                @update:file-list="updateValue({ [item.key]: $event }, item)"
                v-on="{
                    preview: item.props?.onPreview || handlePreview,
                }"
                v-bind="item?.props || {}"
            >
                <slot name="uploadContent" :data="formData">
                    <template v-if="typeof item.props?.uploadContent === 'string'">
                        {{ item?.props?.uploadContent }}
                    </template>
                    <template v-else>
                        <component :is="item.props?.uploadContent" v-bind="item.props?.uploadContentProps || {}" />
                    </template>
                </slot>
                <GupoImage
                    :style="{ display: 'none' }"
                    :preview="{
                        visible: previewVisible,
                        onVisibleChange: setVisible,
                    }"
                    :src="previewImage"
                />
            </component>
        </template>
        <template v-else-if="item.type === 'upload.dragger'">
            <component
                :is="compositeComponents['upload.dragger']"
                :file-list="formData[item.key]"
                @update:file-list="updateValue({ [item.key]: $event }, item)"
                v-bind="item?.props || {}"
                :maxCount="1"
            >
                <slot name="uploadContent" :data="formData">
                    <template v-if="typeof item.props?.uploadContent === 'string'">
                        {{ item?.props?.uploadContent }}
                    </template>
                    <template v-else>
                        <component :is="item.props?.uploadContent" v-bind="item.props?.uploadContentProps || {}" />
                    </template>
                </slot>
            </component>
        </template>
        <!-- 自定义组件 -->
        <template v-else-if="item.type === 'custom'">
            <component
                :is="item.component"
                :modelValue="formData[item.key]"
                @update:modelValue="updateValue({ [item.key]: $event }, item)"
                v-bind="item?.props || {}"
            />
        </template>
        <!-- 提交按钮 -->
        <template v-else-if="item.type === 'operation'">
            <GupoButton v-if="item.submitButton" type="primary" html-type="submit" :loading="loading" v-bind="item.submitButton.props">
                {{ item.submitButton.text || '提交' }}
            </GupoButton>
            <GupoButton v-if="item.cancelButton" @click="$emit('cancel', $event)" v-bind="item.cancelButton.props">
                {{ item.cancelButton.text || '取消' }}
            </GupoButton>
        </template>
    </GupoFormItem>
</template>

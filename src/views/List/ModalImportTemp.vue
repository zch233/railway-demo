<script lang="jsx">
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { gupoMessage, GupoModal } from '@src/components/UI';
import GlobalFormItem from '@src/components/GlobalForm/Item.vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { useStoreApp } from '@src/store/modules/app';

export default defineComponent({
    name: 'ModalImportTemp',
    emits: ['updateDataSourceTemp', 'success'],
    expose: ['showModal'],
    setup(props, context) {
        const appStore = useStoreApp();
        const modal = reactive({
            visible: false,
            loading: false,
            formData: {
                file: [],
                clear: '0',
                date: [],
            },
        });
        const validate = () => {
            if (!modal.formData.file?.length) {
                gupoMessage.error('请上传文件');
                throw '校验错误';
            }
            if (!modal.formData.date?.length) {
                gupoMessage.error('请选择生效日期');
                throw '校验错误';
            }
        };
        const handelOk = () => {
            validate();
            const file = modal.formData.file[0];
            const reader = new FileReader();
            reader.onload = e => {
                const bytes = new Uint8Array(e.target.result);
                const wb = XLSX.read(bytes, { cellDates: true });
                const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, range: 1 });
                const key = Date.now();
                const list = data
                    .slice(1)
                    .filter(v => v.length)
                    .map(arr => {
                        const item = arr.reduce((res, cur, index) => {
                            if (index === 0) {
                                res[index] = key + '-' + cur;
                            } else {
                                res[index] = typeof cur === 'object' ? dayjs(cur).format('HH:mm') : cur;
                            }
                            return res;
                        }, {});
                        item.status = '1';
                        item.dateRange = modal.formData.date;
                        return item;
                    });
                context.emit('updateDataSourceTemp', { list, total: list.length });
                context.emit('success');
                modal.visible = false;
                gupoMessage.success('导入成功');
            };
            reader.readAsArrayBuffer(file);
            if (modal.formData.clear === '1') {
                appStore.setOrderList([]);
            }
        };
        const showModal = () => (modal.visible = true);
        const Modal = () => (
            <GupoModal
                visible={modal.visible}
                onUpdate:value={e => (modal.visible = e)}
                onOk={handelOk}
                onCancel={() => (modal.visible = false)}
                confirmLoading={modal.loading}
                title='临客导入'
            >
                <GlobalFormItem
                    labelCol={{ span: 0 }}
                    formData={modal.formData}
                    item={{
                        key: 'file',
                        type: 'upload.dragger',
                        props: {
                            customRequest: e => (modal.formData.file = [e.file]),
                            uploadContent: () => (
                                <div>
                                    <p class='ant-upload-drag-icon'>
                                        <InboxOutlined />
                                    </p>
                                    <p class='ant-upload-text'>单击或将文件拖动到此区域以上传</p>
                                    <p class='ant-upload-hint'>文件提示</p>
                                </div>
                            ),
                            name: 'file',
                        },
                    }}
                />
                <GlobalFormItem
                    labelCol={{ span: 0 }}
                    formData={modal.formData}
                    onUpdate:formData={e => (modal.formData.date = e.date)}
                    item={{
                        key: 'date',
                        label: '生效日期',
                        type: 'datePicker.rangePicker',
                        props: {
                            valueFormat: 'YYYY-MM-DD',
                        },
                    }}
                />
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

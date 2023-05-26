<script lang="jsx">
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { gupoMessage, GupoModal } from '@src/components/UI';
import GlobalFormItem from '@src/components/GlobalForm/Item.vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { useStoreApp } from '@src/store/modules/app';

export default defineComponent({
    name: 'ModalImport',
    emits: ['updateColumns', 'updateDataSource', 'updatePlaces', 'updateWays', 'success'],
    expose: ['showModal'],
    setup(props, context) {
        const appStore = useStoreApp();
        const modal = reactive({
            visible: false,
            loading: false,
            formData: {
                file: [],
                clear: '0',
            },
        });
        const handelOk = () => {
            const file = modal.formData.file[0];
            const reader = new FileReader();
            reader.onload = e => {
                const bytes = new Uint8Array(e.target.result);
                const wb = XLSX.read(bytes, { cellDates: true });
                const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, range: 1 });
                context.emit(
                    'updateColumns',
                    data[0].map((title, key) => ({ key, title }))
                );
                const list = data
                    .slice(1)
                    .filter(v => v.length)
                    .map(arr => {
                        const item = arr.reduce((res, cur, index) => {
                            res[index] = typeof cur === 'object' ? dayjs(cur).format('HH:mm') : cur;
                            return res;
                        }, {});
                        item.status = '1';
                        return item;
                    })
                    .sort(
                        (a, b) =>
                            new Date(`${dayjs().format('YYYY-MM-DD')} ${a[4] === '=' ? a[5] : a[4]}`).getTime() -
                            new Date(`${dayjs().format('YYYY-MM-DD')} ${b[4] === '=' ? b[5] : b[4]}`).getTime()
                    );
                context.emit('updateDataSource', { list, total: list.length });
                context.emit('updatePlaces', [...new Set(list.map(v => v[1]))]);
                context.emit('updatePlatforms', [...new Set(list.map(v => v[6]))]);
                context.emit('updateWays', [...new Set(list.map(v => v[7]))]);
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
                title='导入'
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
                    onUpdate:formData={e => (modal.formData = e)}
                    item={{
                        key: 'clear',
                        label: '是否清空调令',
                        type: 'radio',
                        props: {
                            options: [
                                {
                                    label: '是的，我要清空',
                                    value: '1',
                                },
                                {
                                    label: '别，我暂时不想',
                                    value: '0',
                                },
                            ],
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

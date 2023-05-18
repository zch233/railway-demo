<script lang="jsx">
import { GupoModal } from '@src/components/UI';
import { useTable } from '@src/views/List/hooks/useTable';

export default defineComponent({
    name: 'ModalExportTable',
    expose: ['showModal'],
    setup() {
        const modal = reactive({
            visible: false,
            data: [],
        });

        const handelOk = () => {
            modal.visible = false;
        };
        const showModal = data => {
            modal.visible = true;
            modal.data = data;
            nextTick(() => refreshTable?.());
        };
        const { Table, refreshTable } = useTable({ exterior: true });
        const Modal = () => (
            <GupoModal
                width='1400px'
                visible={modal.visible}
                onUpdate:value={e => (modal.visible = e)}
                onOk={handelOk}
                onCancel={() => (modal.visible = false)}
                confirmLoading={modal.loading}
                title='图标统计'
            >
                <Table tableData={modal.data} />
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

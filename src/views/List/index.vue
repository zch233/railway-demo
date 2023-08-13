<script lang="jsx">
import ModalImport from '@src/views/List/ModalImport.vue';
import ModalImportTemp from '@src/views/List/ModalImportTemp.vue';
import ModalOrder from '@src/views/List/ModalOrder.vue';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import ModalExport from '@src/views/List/ModalExport.vue';
import { useTable } from '@src/views/List/hooks/useTable';

export default defineComponent({
    name: 'List',
    setup() {
        const $modalImport = ref();
        const $modalImportTemp = ref();
        const $modalOrder = ref();
        const $modalExport = ref();
        const {
            Table,
            setColumns,
            setDataSource,
            setPlaces,
            setPlatforms,
            setPlatformsRules,
            setWays,
            setDataSourceTemp,
            setSelectedRowKeys,
            refreshTable,
            dataSourceTemp,
        } = useTable();

        return () => (
            <div class='container'>
                <Table
                    onImport={() => $modalImport.value.showModal()}
                    onImportTemp={() => $modalImportTemp.value.showModal()}
                    onOrder={e => $modalOrder.value.init(e)}
                    onExport={e => $modalExport.value.showModal(e)}
                />
                <ModalImport
                    ref={$modalImport}
                    onSuccess={() => refreshTable()}
                    onUpdateColumns={e => setColumns(e)}
                    onUpdateDataSource={e => setDataSource(e)}
                    onUpdatePlaces={e => setPlaces(e)}
                    onUpdatePlatforms={e => setPlatforms(e)}
                    onUpdatePlatformsRules={e => setPlatformsRules(e)}
                    onUpdateWays={e => setWays(e)}
                />
                <ModalImportTemp
                    ref={$modalImportTemp}
                    onSuccess={() => refreshTable()}
                    onUpdateDataSourceTemp={e => {
                        const list = e.list.concat(dataSourceTemp.value.list).filter(v => dayjs().isBefore(dayjs(v.dateRange[1])));
                        setDataSourceTemp({
                            list,
                            total: list.length,
                        });
                    }}
                />
                <ModalOrder
                    ref={$modalOrder}
                    onSuccess={() => {
                        refreshTable();
                        setSelectedRowKeys([]);
                    }}
                />
                <ModalExport ref={$modalExport} />
            </div>
        );
    },
});
</script>

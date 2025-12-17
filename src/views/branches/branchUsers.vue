<template>
    <DataTable
        v-model:filters="allBranchUsersFilter"
        :value="allBranchUsers"
        dataKey="id"
        paginator
        :rows="10"
        filterDisplay="menu"
        :globalFilterFields="[]"
        responsiveLayout="scroll"
        class="text-right"
    >
    <!-- ==============================
         Table Header with Global Search
         ============================== -->
        <template #header>
            <div class="flex justify-between">
                <IconField>
                    <InputIcon class="fas fa-search" />
                    <InputText 
                        v-model="allBranchUsersFilter.global.value" 
                        placeholder="بحث..." 
                    />
                </IconField>
            </div>
        </template>

        <!-- ==============================
         Empty Table Message
         ============================== -->
        <template #empty>
            <Message severity="warn">لا توجد عجلات مسجلة لهذا المركز</Message>
        </template>

        <Column field="id" sortable>
            <template #header>
                <i class="fas fa-hashtag text-gray-500"/>
            </template>
        </Column>

        <Column field="fullname" sortable header="الاسم الكامل">
            <template #header>
                <i class="fas fa-user text-gray-500"/>
            </template>
        </Column>

        <Column field="login.username" sortable header="اسم السمتخدم">
            <template #header>
                <i class="fas fa-user-tag text-gray-500"/>
            </template>
        </Column>

        <Column field="contact.email" sortable header="البريد الالكتروني">
            <template #header>
                <i class="fas fa-envelope text-gray-500"/>
            </template>
        </Column>

        <Column field="constact.phone1" sortable header="رقم الهاتف 1">
            <template #header>
                <i class="fas fa-phone-flip text-gray-500"/>
            </template>
        </Column>

        <Column field="contact.phone2" sortable header="رقم الهاتف 2">
            <template #header>
                <i class="fas fa-phone-flip text-gray-500"/>
            </template>
        </Column>

        <Column field="contact.address" sortable header="العنوان">
            <template #header>
                <i class="fa-solid fa-map-location-dot text-gray-500"/>
            </template>
        </Column>

        <Column field="status" sortable header="الحالة">
            <template #header>
                <i class="fas fa-eye text-gray-500"/>
            </template>
            <template #body="{data}">
                <Tag v-if="data.status === 1" icon="fas fa-eye" severity="success" value="مفعل"/>
                <Tag v-if="data.status === 0" icon="fas fa-eye-slash" severity="danger" value="معطل"/>
            </template>
        </Column>

        <Column field="role" sortable header="نوع المستخدم">
            <template #header>
                <i class="fas fa-marker text-gray-500"/>
            </template>
            <template #body="{data}">
                <Tag v-if="data.role === 'employee'" icon="fas fa-user" severity="info" value="موظف"/>
                <Tag v-if="data.role === 'branch_admin'" icon="fas fa-user-tag" severity="warn" value="مدير مركز"/>
                <Tag v-if="data.role === 'owner'" icon="fas fa-user-tie" severity="secondary" value="مالك"/>
            </template>
        </Column>

        <Column header="خيارات">
            <template #header>
                <i class="fas fa-clone"/>
            </template>
            <template #body="{data}">
                <Button
                    icon="fa-solid fa-clock-rotate-left"
                    severity="success"
                    rounded
                    variant="outlined"
                    aria-label="تحركات المستخدم"
                    class="p-button-sm"
                    />
            </template>
        </Column>
    </DataTable>
</template>
<script setup lang="ts">
/* =====================================
   PROPS
   ===================================== */
const props = defineProps<{ branchId: number }>();

/* =====================================
   IMPORTS
   ===================================== */
import { ref, reactive, watch } from "vue";
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Message from 'primevue/message';
import { FilterMatchMode } from "@primevue/core/api";
import UsersService from "../users/usersService";

/* =====================================
STATE VARIABLES
===================================== */
const userLogDialogVisible = ref(false);   // Dialog visibility
const allBranchUsers = ref([]);           // Vehicles for this branch
const allUserLog = ref<any[]>([]);
// Filters for DataTables
const allBranchUsersFilter = reactive({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const userLogFilter = reactive({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

watch(
    ()=>props.branchId,
    async(newId)=>{
        if(!newId) return;
        await fetchAllUsers(newId);
    },
    {immediate: true}
);

async function fetchAllUsers(branchId: number) {
    try {
        const response = await UsersService.getByBranchId(branchId);
        allBranchUsers.value = response.data;
        console.log(allBranchUsers.value)
    } catch (err) {
        console.log(err);
    }
}

const openUserLogDialog = ()=>{
    userLogDialogVisible.value = true;
    allUserLog.value = [{name: 'obraq'}];
}
</script>
<style scoped>

</style>
<template>
  <!-- ==============================
       Vehicles DataTable
       Displays all vehicles of a branch
       ============================== -->
  <DataTable
    v-model:filters="vehicleFilter"
    :value="allBrancheVehicles"
    dataKey="id"
    paginator
    :rows="10"
    filterDisplay="menu"
    :globalFilterFields="['brand', 'model', 'plate_number']"
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
            v-model="vehicleFilter.global.value" 
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

    <!-- ==============================
         Vehicle Columns
         ============================== -->
    <Column field="brand" header="الماركة" sortable>
      <template #header>
        <i class="fa-solid fa-car-side text-gray-500"></i>
      </template>
    </Column>

    <Column field="model" header="الموديل" sortable>
      <template #header>
        <i class="fa-solid fa-car-side text-gray-500"></i>
      </template>
    </Column>

    <Column field="color" header="اللون" sortable>
      <template #header>
        <i class="fa-solid fa-palette text-gray-500"></i>
      </template>
    </Column>

    <Column field="plate_number" header="رقم اللوحة" sortable>
      <template #header>
        <i class="fa-solid fa-id-card text-gray-500"></i>
      </template>
    </Column>

    <Column field="year" header="السنة" sortable>
      <template #header>
        <i class="fa-solid fa-calendar-week text-gray-500"></i>
      </template>
    </Column>

    <!-- Owner Type Column -->
    <Column field="owner_type" header="نوع المالك" sortable>
      <template #header>
        <i class="fa-solid fa-users-viewfinder text-gray-500"/>
      </template>
      <template #body="{data}">
        <Tag v-if="data.owner_type === 'branche'" icon="fas fa-shop" severity="warn" value="المركز"></Tag>
        <Tag v-if="data.owner_type === 'otherOwner'" icon="fas fa-user" severity="info" value="مستثمر"></Tag>
      </template>
    </Column>

    <!-- Owner Name Column -->
    <Column field="owner.fullname" header="المالك" sortable>
      <template #header>
        <i class="fas fa-user-alt text-gray-500"/>
      </template>
    </Column>

    <!-- Vehicle Status Column -->
    <Column field="status" header="حالة العجلة" sortable>
      <template #header>
        <i class="fas fa-diagram-project"/>
      </template>
      <template #body="{data}">
        <Tag v-if="data.status === 'available'" icon="fas fa-car-side" severity="info" value="متاح"></Tag>
        <Tag v-if="data.status === 'rented'" icon="fas fa-hourglass-start" severity="warn" value="مستاجر"></Tag>
        <Tag v-if="data.status === 'maintenance'" icon="fas fa-car-burst" severity="error" value="صيانة"></Tag>
      </template>
    </Column>

    <!-- Created At Column -->
    <Column field="created_at" header="تاريخ الاضافة" sortable>
      <template #header>
        <i class="fas fa-calendar-alt text-gray-500"/>
      </template>
      <template #body="{data}">
        <Tag
          v-if="data.created_at"
          icon="fas fa-clock"
          severity="secondary"
          :value="formatDate(data.created_at)"
        />
        <Tag
          v-else
          icon="fas fa-clock"
          severity="secondary"
          value="غير متاح"
        />
      </template>
    </Column>

    <!-- More Details Button Column -->
    <Column header="تفاصيل اكثر">
      <template #header>
        <i class="fas fa-clone"/>
      </template>
      <template #body="{data}">
        <Button 
          icon="fa-solid fa-clock-rotate-left" 
          severity="success" 
          rounded 
          variant="outlined" 
          aria-label="تفاصيل اكثر"
          class="p-button-sm"
          @click="openVehicleLogDialog(data.vehicle_id)"
        />
      </template>
    </Column>
  </DataTable>

  <!-- ==============================
       Vehicle Log Dialog
       Displays logs for selected vehicle
       ============================== -->
  <Dialog 
    v-model:visible="vehicleLogDialogVisible"
    header="تتبع العجلة"
    modal
    :style="{ width: '75vw' }"
    dir="rtl"
  >
    <div class="flex flex-column gap-4 mt-3">
      <DataTable
        v-model:filters="vehicleLogFilter"
        :value="vehicleLog"
        dataKey="log_id"
        paginator
        :rows="10"
        filterDisplay="menu"
        :globalFilterFields="['date', 'action', 'details', 'performed_by.fullname']"
        class="text-right"
      >
        <!-- Header with search -->
        <template #header>
          <div class="flex justify-between">
            <IconField>
              <InputIcon class="fas fa-search" />
              <InputText v-model="vehicleLogFilter.global.value" placeholder="بحث..."/>
            </IconField>
          </div>
        </template>

        <!-- Empty Table Message -->
        <template #empty>
          <Message severity="warn"><i class="fas fa-info"/> لاتوجد بيانات بعد</Message>
        </template>

        <!-- Vehicle Log Columns -->
        <Column field="log_id" sortable>
          <template #header>
            <i class="fas fa-hashtag text-gray-500"/>
          </template>
        </Column>

        <Column field="date" header="تاريخ الحدث" sortable>
          <template #header>
            <i class="fas fa-calendar-alt text-gray-500"/>
          </template>
        </Column>

        <Column field="action" header="الحدث" sortable>
          <template #header>
            <i class="fas fa-bell text-gray-500"/>
          </template>
        </Column>

        <Column field="details" header="التفاصيل" sortable>
          <template #header>
            <i class="fas fa-text-width text-gray-500"/>
          </template>
        </Column>

        <Column field="performed_by.fullname" header="بواسطة" sortable>
          <template #header>
            <i class="fas fa-user text-gray-500"/>
          </template>
          <template #body="{data}">
            <Tag
              v-if="data.performed_by && data.performed_by.fullname"
              icon="fas fa-user-tag"
              severity="info"
              :value="data.performed_by.fullname"
            />
            <Tag
              v-else
              icon="fas fa-user-slash"
              severity="secondary"
              value="غير محدد"
            />
          </template>
        </Column>

        <Column field="created_at" header="الوقت الفعلي" sortable>
          <template #header>
            <i class="fas fa-clock text-gray-500"/>
          </template>
          <template #body="{data}">
            <Tag
              v-if="data.created_at"
              icon="fas fa-clock"
              severity="secondary"
              :value="formatDate(data.created_at)"
            />
            <Tag
              v-else
              icon="fas fa-clock"
              severity="secondary"
              value="غير متاح"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </Dialog>
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
import vehicleService from "../vehicles/vehicelsService";

/* =====================================
   STATE VARIABLES
   ===================================== */
const vehicleLogDialogVisible = ref(false);   // Dialog visibility
const allBrancheVehicles = ref([]);           // Vehicles for this branch
const vehicleLog = ref([]);                   // Vehicle logs

// Filters for DataTables
const vehicleFilter = reactive({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const vehicleLogFilter = reactive({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

/* =====================================
   MOCK DATA (Replace with API later)
   ===================================== */
const mockLogs = [
  {
    log_id: 1,
    vehicle_id: 2,
    date: "2025-10-20",
    action: "فحص دوري",
    details: "تم فحص المحرك وتغيير زيت الفرامل.",
    performed_by: { user_id: 11, fullname: "علي محمد" },
    created_at: "2025-10-20 09:15:00",
  },
  {
    log_id: 2,
    vehicle_id: 2,
    date: "2025-10-25",
    action: "إصلاح",
    details: "استبدال بطارية السيارة ونظام الإشعال.",
    performed_by: { user_id: 12, fullname: "مريم خالد" },
    created_at: "2025-10-25 14:40:00",
  }
];

/* =====================================
   WATCHERS
   ===================================== */
// Fetch vehicles when branchId prop changes
watch(
  () => props.branchId,
  async (newId) => {
    if (!newId) return;
    await fetchAllVehicles(newId);
  },
  { immediate: true }
);

/* =====================================
   METHODS
   ===================================== */
// Fetch vehicles from API
async function fetchAllVehicles(branchId: number) {
  try {
    const response = await vehicleService.getByOwner('branche', branchId);
    allBrancheVehicles.value = response.data;
  } catch (err) {
    console.error(err);
  }
}

// Open vehicle log dialog and load logs
const openVehicleLogDialog = (vehicleId: number) => {
  if (!vehicleId) return; 
  try {
    const response = vehicleService.getVehicleLog(vehicleId)
    vehicleLog.value = response.data;
    console.log(vehicleLog.value)
  } catch (err) {
    console.log(err)
  } finally {
    vehicleLogDialogVisible.value = true;
  }
}

// Format date into readable string
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
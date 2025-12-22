<template>
  <div class="card" dir="rtl">
    <!-- =======================
      BREADCRUMB + ADD BUTTON
    ======================== -->
    <div class="flex justify-center mt-3 mb-3">
      <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>

    <Button
      label="إضافة جديد"
      icon="fas fa-plus"
      class="p-button-sm mb-3"
      @click="openAddEditVehiclesDialog()"
    />

    <!-- =======================
      LOADING OVERLAY
    ======================== -->
    <div
      v-if="isLoading"
      class="fixed top-0 left-0 w-screen h-screen flex align-items-center justify-content-center z-5"
      style="background-color: #2828289c;"
    >
      <div class="text-primary-500 border-round text-center">
        <i class="fa-solid fa-circle-notch fa-spin fa-spin-reverse fa-2xl" style="font-size: 80px;"></i>
      </div>
    </div>

    <!-- =======================
      VEHICLES DATA TABLE
    ======================== -->
    <DataTable
      v-model:filters="vehiclesFilter"
      :value="allVehicles"
      dataKey="vehicle_id"
      paginator
      :rows="10"
      filterDisplay="menu"
      :globalFilterFields="['brand', 'model', 'plate_number']"
      responsiveLayout="scroll"
      class="text-right"
    >
      <!-- ====== Table Header with Search ====== -->
      <template #header>
        <div class="flex justify-between">
          <IconField>
            <InputIcon class="fas fa-search" />
            <InputText v-model="vehiclesFilter.global.value" placeholder="بحث..." />
          </IconField>
        </div>
      </template>

      <template #empty>
        <Message severity="warn">لم يتم اضافة عجلات بعد</Message>
      </template>

      <!-- ====== Table Columns ====== -->
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

      <Column field="year" header="سنة الصنع" sortable>
        <template #header>
          <i class="fa-solid fa-calendar-week text-gray-500"></i>
        </template>
      </Column>

      <Column field="owner_type" header="نوع المالك" sortable>
        <template #header>
          <i class="fa-solid fa-users-viewfinder text-gray-500" />
        </template>
        <template #body="{ data }">
          <Tag v-if="data.owner_type === 'branche'" icon="fas fa-shop" severity="warn" value="المركز" />
          <Tag v-if="data.owner_type === 'otherOwner'" icon="fas fa-user" severity="info" value="مستثمر" />
        </template>
      </Column>

      <Column field="owner.fullname" header="المالك" sortable>
        <template #header>
          <i class="fas fa-user-alt text-gray-500" />
        </template>
        <template #body="{ data }">
          <span v-if="data.owner_type === 'branche'">
            {{ data.branch?.name || '---' }}
          </span>
          <span v-else-if="data.owner_type === 'otherOwner'">
            {{ data.owner?.fullname || '---' }}
          </span>
          <span v-else>---</span>
        </template>
      </Column>

      <Column field="status" header="حالة العجلة" sortable>
        <template #header>
          <i class="fas fa-diagram-project text-gray-500" />
        </template>

        <template #body="{ data }">
          <Tag
            v-if="data.status === 'available'"
            icon="fas fa-car-side"
            severity="info"
            value="متاح"
          />
          <Tag
            v-else-if="data.status === 'rented'"
            icon="fas fa-hourglass-start"
            severity="warn"
            value="مستأجر"
          />
          <Tag
            v-else-if="data.status === 'maintenance'"
            icon="fas fa-car-burst"
            severity="danger"
            value="صيانة"
          />
          <Tag
            v-else
            icon="fas fa-question"
            severity="secondary"
            value="غير معروف"
          />
        </template>
      </Column>

      <Column field="created_at" header="تاريخ الاضافة" sortable>
        <template #header>
          <i class="fas fa-calendar-alt text-gray-500" />
        </template>
      </Column>

      <!-- ====== Actions Column ====== -->
      <Column header="الادارة">
        <template #header>
          <i class="fas fa-cogs text-gray-500" />
        </template>
        <template #body="{ data }">
          <Button 
            icon="fa-solid fa-clock-rotate-left" 
            severity="secondary" 
            rounded 
            variant="outlined" 
            class="p-button-sm" 
            @click="openVehicleLogVisible(data)" 
          />

          <Button
            icon="fa-solid fa-edit"
            severity="secondary"
            rounded
            variant="outlined"
            class="p-button-sm ml-2 mr-2"
            @click="openAddEditVehiclesDialog(data)"
          />

          <Button
            icon="fa-solid fa-trash-alt"
            severity="danger"
            rounded
            variant="outlined"
            class="p-button-sm"
            @click="confirmDeleteVehicles(data)"
          />

        </template>
      </Column>
    </DataTable>

    <!-- =======================
      ADD / EDIT VEHICLE DIALOG
    ======================== -->
    <Dialog
      v-model:visible="addEditVehiclesFormDialogVisible"
      :header="isEditMode ? 'تعديل بيانات العجلة' : 'إضافة عجلة جديدة'"
      :style="{ width: '30vw' }"
      modal
      @hide="resetForm"
      dir="rtl"
    >
      <div class="flex flex-column gap-4 mt-3">
        <!-- Vehicle fields -->
        <FloatLabel variant="on">
          <InputText for="brand_feild" v-model="vehicleForm.brand" fluid />
          <label for="brand_feild" class="font-semibold mb-2 block"><i class="fas fa-car"/> النوع</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText id="model_feild" v-model="vehicleForm.model" fluid />
          <label for="model_feild" class="font-semibold mb-2 block"><i class="fa-solid fa-car-side"/> الموديل</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputNumber id="year_feild" v-model="vehicleForm.year" fluid :useGrouping="false" end="4" />
          <label for="year_feild" class="font-semibold mb-2 block"><i class="fas fa-calendar-alt"/> سنة الصنع</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText id="color_feild" v-model="vehicleForm.color" fluid />
          <label for="color_feild" class="font-semibold mb-2 block"><i class="fas fa-brush"/> لون العجلة</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText id="plate_number_feild" v-model="vehicleForm.plate_number" fluid />
          <label for="plate_number_feild" class="font-semibold mb-2 block"><i class="fas fa-hashtag"/> رقم اللوحة</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Select id="branch_id_feild" v-model="vehicleForm.branch_id" :options="allBranches" optionValue="value" optionLabel="name" class="w-full" />
          <label for="branch_id_feild" class="font-semibold mb-2 block"><i class=""/> تبعية العجلة</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Select id="owner_type_feild" v-model="vehicleForm.owner_type" :options="vehicleOwnerType" optionValue="value" optionLabel="name" placeholder="عائدية العجلة" showClear class="w-full" />
          <label for="owner_type_feild" class="font-semibold mb-2 block"><i class=""/> عائدية العجلة</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Select id="owner_id_feild" v-model="vehicleForm.owner_id" :options="ownerOptions" optionValue="value" optionLabel="name" class="w-full" />
          <label for="owner_id_feild" class="font-semibold mb-2 block"><i class=""/> اسم المالك</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Select id="status_feild" v-model="vehicleForm.status" :options="vehicleStatus" optionValue="value" optionLabel="name" placeholder="حالة العجلة" class="w-full" />
          <label for="status_feild" class="font-semibold mb-2 block"><i class=""/> حالة العجلة</label>
        </FloatLabel>
      </div>

      <!-- ====== Footer Buttons ====== -->
      <template #footer>
        <Button 
          label="الغاء" 
          icon="fas fa-times" 
          severity="secondary" 
          class="p-button-sm" 
          @click="addEditVehiclesFormDialogVisible = false" 
        />
        <Button 
          :label="isEditMode ? 'حفظ' : 'إضافة'" 
          icon="fas fa-floppy-disk" 
          :loading="isSaving" 
          class="p-button-sm" 
          @click="saveNewVehicle()" 
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="vehicleLogDialogVisible"
      header="تاريخ العجلة"
      :style="{width: '75vw'}"
      modal
      maximizable
      dir="rtl"
    >
    <div class="card">
      <DataTable
        v-model:filters="vehicleLogFilters"
        :value="vehicleLogs"
        dataKey="vehicle_id"
        paginator
        :rows="10"
        filterDisplay="menu"
        :globalFilterFields="['action', 'date', 'details', 'performed_by.fullname']"
        responsiveLayout="scroll"
      >
        <template #header>
          <div class="flex justify-between">
            <IconField>
              <InputIcon class="fas fa-search"/>
              <InputText v-model="vehicleLogFilters.global.value" placeholder="بحث..."/>
            </IconField>
          </div>
        </template>

        <template #empty>
          <Message severity="warn">لم يتم العثور على بيانات</Message>
        </template>

        <Column field="action" sortable>
          <template #header>
            <i class="fas fa-cog text-gray-500"/>
            العملية
          </template>
          <template #body="slotProps">
            <Tag
              :value="getActionLabel(slotProps.data.action)"
              :severity="getActionSeverity(slotProps.data.action)"
              :icon="getActionIcon(slotProps.data.action)"
            />
          </template>
        </Column>

        <Column field="date" sortable>
          <template #header>
            <i class="fas fa-calendar text-gray-500"/>
            التاريخ
          </template>
          <template #body="slotProps">
            {{
              slotProps.data.date
                ? formatDate(slotProps.data.date)
                : ''
            }}
          </template>
        </Column>

        <Column field="details">
          <template #header>
            <i class="fas fa-info text-gray-500"/>
            البيانات
          </template>
        </Column>

        <Column field="performed_by.fullname" sortable>
          <template #header>
            <i class="fas fa-user-tie text-gray-500"/>
            الموظف
          </template>
        </Column>
      </DataTable>
    </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
/* ===================================================
   IMPORTS SECTION
=================================================== */
import { ref, reactive, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

import Breadcrumb from "primevue/breadcrumb";
import Message from "primevue/message";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Select from "primevue/select";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import FloatLabel from 'primevue/floatlabel';

import vehicleService, { type Vehicle } from "../vehicles/vehicelsService";
import UsersService from "../users/usersService";
import branchService from "../branches/branchesService";
import { FilterMatchMode } from "@primevue/core/api";

/* ===================================================
   STATE VARIABLES
=================================================== */

// Toast for notifications
const toast = useToast();

// Confirm dialog instance
const confirm = useConfirm();

// List of all vehicles
const allVehicles = ref<Vehicle[]>([]);

// Boolean flags
const isEditMode = ref(false); // Whether form is in edit mode
const isLoading = ref(true);   // Table loading state
const isSaving = ref(false);   // Save button loading
const isConfirming = ref(false); // Prevents double confirmation clicks

// Dialog visibility
const addEditVehiclesFormDialogVisible = ref(false);
const vehicleLogDialogVisible = ref(false);
// Dropdown lists
const ownerOptions = ref<any[]>([]); // Owners (either branches or users)
const allBranches = ref<any[]>([]);  // Branch options
const allUsers = ref<any[]>([]);     // All users (for filtering)
const vehicleLogs = ref<any[]>([]);

// Filters for DataTable
const vehiclesFilter = reactive({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const vehicleLogFilters = reactive({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
});

// Vehicle form data
const vehicleForm = ref<Vehicle>({
  plate_number: "",
  brand: "",
  model: "",
  year: 0,
  color: "",
  current_odometer: 0,
  fule_level: "full",
  owner_type: null,
  owner_id: 0,
  branch_id: 0,
  status: "available",
});

// Dropdown options for owner type and vehicle status
const vehicleOwnerType = [
  { name: "مركز", value: "branche" },
  { name: "مستثمر", value: "otherOwner" },
];

const vehicleStatus = [
  { name: "متاحه", value: "available" },
  { name: "مستاجرة", value: "rented" },
  { name: "صيانة", value: "maintenance" },
];

// Breadcrumb configuration
const breadcrumbHome = ref({ icon: "pi pi-home", to: "/" });
const breadcrumbItems = ref([
  { label: "الرئيسية", to: "/" },
  { label: "العجلات", to: "/vehicles" },
]);

function getActionLabel(action: string) {
  switch (action) {
    case 'wash': return 'غسيل';
    case 'maintenance': return 'صيانة';
    case 'rent': return 'ايجار';
    case 'infoUpdate': return 'تحديث بيانات';
    default: return action;
  }
}

function getActionSeverity(action: string) {
  switch (action) {
    case 'wash': return 'info';
    case 'maintenance': return 'warn';
    case 'rent': return 'success';
    case 'infoUpdate': return 'secondary';
    default: return 'secondary';
  }
}

function getActionIcon(action: string) {
  switch (action) {
    case 'wash': return 'fa-solid fa-droplet';
    case 'maintenance': return 'fa-solid fa-screwdriver-wrench';
    case 'rent': return 'fa-solid fa-dollar-sign';
    case 'infoUpdate': return 'fa-solid fa-file-pen';
    default: return 'fa-solid fa-circle-question';
  }
}
/* ===================================================
   DATA FETCHING FUNCTIONS
=================================================== */

/**
 * Fetch all vehicles from backend API
 */
const fetchAllVehicles = async () => {
  isLoading.value = true;
  try {
    const response = await vehicleService.getAll();
    allVehicles.value = response.data;
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to fetch vehicles",
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};


/**
 * Fetch all branches
 */
const fetchAllBranches = async () => {
  try {
    const response = await branchService.getAll();
    allBranches.value = response.map((b: any) => ({
      name: b.name,
      value: b.branch_id,
    }));
  } catch (err) {
    console.error(err);
  }
};

/**
 * Fetch all users (investors)
 */
const fetchAllUsers = async () => {
  try {
    const response = await UsersService.getAll();
    allUsers.value = response.map((u: any) => ({
      name: u.fullname,
      value: u.user_id,
    }));
  } catch (err) {
    console.error(err);
  }
};

/* ===================================================
   DIALOG & FORM MANAGEMENT
=================================================== */

/**
 * Opens Add/Edit Vehicle Dialog
 */
const openAddEditVehiclesDialog = (vehicle: Vehicle | null = null) => {
  if (vehicle) {
    // Editing existing vehicle
    isEditMode.value = true;
    vehicleForm.value = {
      ...vehicle,
      owner_type: vehicle.owner_type ?? null,
      branch_id: vehicle.branch?.branch_id || 0,
      year: vehicle.year || 0,
    };
  } else {
    // Adding new vehicle
    resetForm();
  }

  // Fetch dropdown data each time
  fetchAllBranches();
  fetchAllUsers();
  addEditVehiclesFormDialogVisible.value = true;
};

const openVehicleLogVisible = async(vehicle: any)=>{
  vehicleLogs.value = [];
  if (!vehicle) {
    toast.add({
      severity: "warn",
      summary: "رسالة تنبيه",
      detail: "حدث خطاء ما اثناء جلب تاريخ العجلة",
      life: 3000,
    });
  } else {
    try {
      const response = await vehicleService.getVehicleLog(vehicle.vehicle_id);
      vehicleLogs.value = response.data;

      vehicleLogDialogVisible.value = true;
    } catch (err: any) {
      console.log(err)
      toast.add({
        severity: "error",
        summary: "رسالة خطاء",
        detail: "حدث خطاء ما اثناء جلب تاريخ العجلة",
        life: 3000,
      });
    }
  }
}

/**
 * Resets form to default values
 */
const resetForm = () => {
  isEditMode.value = false;
  vehicleForm.value = {
    plate_number: "",
    brand: "",
    model: "",
    year: 0,
    color: "",
    current_odometer: 0,
    fule_level: "full",
    owner_type: "branche",
    owner_id: 0,
    branch_id: 0,
    status: "available",
  };
};

/* ===================================================
   CRUD OPERATIONS
=================================================== */

/**
 * Create or Update a vehicle record
 */
const saveNewVehicle = async () => {
  isSaving.value = true;
  try {
    if (isEditMode.value) {
      await vehicleService.update(vehicleForm.value.vehicle_id, vehicleForm.value);
      toast.add({ severity: "success", summary: "Success", detail: "Vehicle updated successfully", life: 3000 });
    } else {
      await vehicleService.create(vehicleForm.value);
      toast.add({ severity: "success", summary: "Success", detail: "Vehicle added successfully", life: 3000 });
    }
  } catch (err) {
    console.error(err);
    toast.add({ severity: "error", summary: "Error", detail: "Failed to save vehicle", life: 3000 });
  } finally {
    isSaving.value = false;
    fetchAllVehicles();
  }
};

/**
 * Confirm and delete a vehicle
 */
const confirmDeleteVehicles = (vehicle: Vehicle) => {
  if (isConfirming.value) return;
  isConfirming.value = true;

  confirm.require({
    message: `هل انت متاكد من حذف بيانات العجلة "${vehicle.brand}"?`,
    header: "تاكيد الحذف",
    icon: "pi pi-exclamation-triangle text-yellow-500",
    acceptLabel: "تاكيد",
    acceptClass: "p-button-sm border border-red-500 bg-red-500 text-white",
    rejectLabel: "الغاء",
    rejectClass: "p-button-sm border border-gray-400 text-gray-600 bg-transparent hover:bg-gray-200",
    accept: async () => {
      try {
        await vehicleService.delete(vehicle.vehicle_id);
        toast.add({ severity: "success", summary: "رسالة نجاح", detail: "تم حذف بيانات العجلة بنجاح", life: 3000 });
      } catch (err) {
        console.log(err)
        toast.add({ severity: "error", summary: "رسالة خطاء", detail: "حدث خطاء ما اثناء حذف بيانات العجلة", life: 3000 });
      } finally {
        isConfirming.value = false;
        fetchAllVehicles();
      }
    },
    reject: () => (isConfirming.value = false),
  });
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);

  // الحصول على اليوم والشهر والسنة بصيغة رقمية
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/* ===================================================
   WATCHERS
=================================================== */

/**
 * Watch owner_type changes to dynamically populate the owner list
 */
watch(
  () => vehicleForm.value.owner_type,
  async (newType) => {
    if (!newType) return;
    if (newType === "branche") {
      const response = await branchService.getAll();
      ownerOptions.value = response.map((b: any) => ({
        name: b.name,
        value: b.branch_id,
      }));
    } else if (newType === "otherOwner") {
      const response = await UsersService.getAll();
      ownerOptions.value = response.map((u: any) => ({
        name: u.fullname,
        value: u.user_id,
      }));
    }
    // Reset selected owner
    vehicleForm.value.owner_id = 0;
  }
);

/* ===================================================
   LIFECYCLE HOOKS
=================================================== */
onMounted(() => {
  fetchAllVehicles();
});
</script>

<style scoped>
/* Optional styling section */
</style>
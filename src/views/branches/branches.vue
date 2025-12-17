<template>
  <div class="card" dir="rtl">
    <!-- ==============================
         Breadcrumb Navigation Section
         ============================== -->
    <div class="card flex justify-center mt-3 mb-3">
      <!-- Breadcrumb component showing current navigation path -->
      <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>

    <!-- ==============================
         Add New Branch Button
         ============================== -->
    <Button 
      label="إضافة جديد" 
      icon="fas fa-plus" 
      class="p-button-sm mb-3"
      @click="openAddEditBranchDialog()"
    />

    <!-- ==============================
         Fullscreen Loading Overlay
         Shows spinner while data is being loaded
         ============================== -->
    <div
      v-if="isLoading"
      class="fixed top-0 left-0 w-screen h-screen flex align-items-center justify-content-center z-5"
      style="background-color: #2828289c;"
    >
      <div class="text-primary-500 border-round text-center">
        <i class="fa-solid fa-circle-notch fa-spin fa-spin-reverse fa-2xl" style="font-size: 80px;"></i>
      </div>
    </div>

    <!-- ==============================
         Branch Tabs
         Each branch is a tab
         ============================== -->
    <Tabs v-model:value="activeTab">
      <!-- Tab Headers -->
      <TabList>
        <Tab 
          v-for="branch in allBranches" 
          :value="branch.branch_id"
          :key="branch.branch_id"
        >
          {{ branch.name }}
        </Tab>
      </TabList>            

      <!-- Tab Panels -->
      <TabPanels>
        <TabPanel 
          v-for="branch in allBranches"
          :key="branch.branch_id"
          :value="branch.branch_id"
        >
          <!-- ==============================
               Branch Information Card
               Shows branch details in columns
               ============================== -->
          <div class="branchInfoCard">
            <div class="grid">
              <!-- Branch Info Column -->
              <div class="col">
                <h2><i class="fa-solid fa-shop"></i> {{ branch.name }}</h2>
                <p><i class="fa-solid fa-map-location-dot"></i> العنوان: {{ branch.address }}</p>
                <Button 
                  as="a" 
                  label="الموقع على الخريطة" 
                  :href="branch.google_map_location" 
                  target="_blank" 
                  rel="noopener" 
                  variant="link" 
                />
              </div>

              <!-- Contact Info Column -->
              <div class="col">
                <h2><i class="fa-solid fa-address-book"></i> التواصل</h2>
                <p><Tag icon="fas fa-phone-flip" severity="info" :value="branch.phone1" /></p>
                <p><Tag icon="fas fa-phone-flip" severity="info" :value="branch.phone2" /></p>
              </div>

              <!-- Manager Info Column -->
              <div class="col">
                <h2><i class="fas fa-user-tie"></i> الادارة</h2>
                <p><i class="fas fa-user"></i> مدير الموقع: {{ branch.manager.fullname }}</p>
                <p>
                  <Tag icon="fas fa-phone-flip" severity="info" :value="branch.manager.phone1" :disabled="branch.manager.phone1 === ''" />
                </p>
                <p>
                  <Tag icon="fas fa-phone-flip" severity="info" :value="branch.manager.phone2" :disabled="branch.manager.phone2 === ''" />
                </p>
                <p>
                  <Tag icon="fas fa-envelope" severity="info" :value="branch.manager.email" :disabled="branch.manager.email === ''" />
                </p>
                <p>
                  <Tag icon="fa-solid fa-location-dot" severity="info" :value="branch.manager.address" :disabled="branch.manager.address === ''" />
                </p>
              </div>

              <!-- Action Buttons Column -->
              <div class="col-fixed">
                <Button 
                  icon="fas fa-edit" 
                  class="ml-1 p-button-sm" 
                  severity="contrast" 
                  rounded 
                  aria-label="تعديل" 
                  @click="openAddEditBranchDialog(branch)" 
                />
                <Button 
                  icon="fas fa-trash-alt" 
                  class="p-button-sm" 
                  severity="danger" 
                  rounded 
                  aria-label="حذف" 
                  @click="confirmDeleteBranch(branch)" 
                />
              </div>
            </div>
          </div>

          <!-- ==============================
               Vehicle Accordion Section
               Shows vehicles per branch
               ============================== -->
          <div class="flex mb-4 gap-2 justify-end mt-4">
            <Button 
              icon="fas fa-car" 
              class="ml-1 p-button-sm" 
              :outlined="activeAccordion !== '0'"
              rounded 
              aria-label="العجلات" 
              @click="activeAccordion = '0'"
            />

            <Button 
              icon="fas fa-users" 
              class="ml-1 p-button-sm" 
              :outlined="activeAccordion !== '1'"
              rounded 
              aria-label="العجلات" 
              @click="activeAccordion = '1'"
            />

            <Button
              icon="fas fa-file-invoice"
              class="ml-1 p-button-sm"
              :outlined="activeAccordion !== '2'"
              rounded
              aria-label="عمليات التاجير"
              @click="activeAccordion = '2'"
              />
          </div>

          <Accordion v-model:value="activeAccordion">
            <AccordionPanel value="0">
              <AccordionHeader>العجلات</AccordionHeader>
              <AccordionContent>
                <!-- Vehicles DataTable only renders for active tab -->
                <BranchVehicles v-if="activeTab === branch.branch_id" :branchId="activeTab"/>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel value="1">
              <AccordionHeader>المستخدمين</AccordionHeader>
              <AccordionContent>
                <branchUsers v-if="activeTab === branch.branch_id" :branch-id="activeTab"/>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel value="2">
              <AccordionHeader>عمليات التاجير</AccordionHeader>
              <AccordionContent>
                <BranchRentals v-if="activeTab === branch.branch_id" :branch-id="activeTab"/>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <!-- ==============================
         Add/Edit Branch Dialog
         ============================== -->
    <Dialog
      v-model:visible="addEditBranchFormDialogVisible"
      :header="isEditMode ? 'حفظ التعديلات' : 'اضافة جديد'"
      :style="{ width: '30vw' }"
      modal
      @hide="resetForm"
      dir="rtl"
    >
      <div class="flex flex-column gap-4 mt-3">
        <!-- Branch Name -->
        <IconField>
          <InputIcon class="fa-solid fa-phone-flip" />
          <InputText v-model="brancheForm.name" placeholder="اسم المركز" fluid />
        </IconField>

        <!-- Branch Address -->
        <IconField>
          <InputIcon class="fa-solid fa-phone-flip" />
          <InputText v-model="brancheForm.address" placeholder="عنوان المركز" fluid />
        </IconField>

        <!-- Branch Phone Numbers -->
        <IconField>
          <InputIcon class="fa-solid fa-phone-flip" />
          <InputText v-model="brancheForm.phone1" placeholder="رقم هاتف المركز" fluid />
        </IconField>
        <IconField>
          <InputIcon class="fa-solid fa-phone-flip" />
          <InputText v-model="brancheForm.phone2" placeholder="رقم هاتف المركز2" fluid />
        </IconField>

        <!-- Manager Selection -->
        <IconField>
          <InputIcon class="fas fa-user-tie" />
          <Select 
            v-model="brancheForm.manager_id" 
            :options="allUsers" 
            filter 
            optionLabel="fullname" 
            optionValue="id" 
            placeholder="اختر مدير المركز" 
            class="w-full md:w-56" 
          />
        </IconField>
      </div>

      <!-- Dialog Footer -->
      <template #footer>
        <Button
          @click="addEditBranchFormDialogVisible = false"
          label="الغاء"
          icon="fas fa-times"
          severity="secondary"
          class="p-button-sm"
        />
        <Button
          :label="isEditMode ? 'حفظ' : 'إضافة'"
          icon="fas fa-floppy-disk"
          :loading="isSaving"
          class="p-button-sm"
          @click="saveBranch()"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
/* =====================================
   IMPORTS SECTION
   ===================================== */
import { ref, reactive, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

// PrimeVue Components
import Breadcrumb from "primevue/breadcrumb";
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Select from 'primevue/select';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

// Services
import branchService, { type Branch } from "./branchesService";
import UsersService from "../users/usersService";
import BranchVehicles from "./BranchVehicles.vue";
import branchUsers from "./branchUsers.vue";
import BranchRentals from "./BranchRentals.vue";
/* =====================================
   STATE VARIABLES
   ===================================== */
const toast = useToast();                 // Toast notification instance
const confirm = useConfirm();             // Confirmation dialog instance

const allBranches = ref<Branch[]>([]);    // List of all branches
const allUsers = ref<any[]>([]);          // List of all users (managers)
const isEditMode = ref(false);            // Determines whether dialog is edit or add mode
const isLoading = ref(true);              // Loading overlay flag
const isSaving = ref(false);              // Form saving state
const isConfirming = ref(false);          // Delete confirmation flag
const activeTab = ref<number | null>(null);  // Currently selected branch tab
const addEditBranchFormDialogVisible = ref(false); // Add/Edit dialog visibility
const activeAccordion = ref('0');         // Active panel in Accordion

// Breadcrumb configuration
const breadcrumbHome = ref({ icon: "pi pi-home", to: "/" });
const breadcrumbItems = ref([
  { label: "الرئيسية", to: "/" },
  { label: "الفروع", to: "/departments" },
]);

// Branch form model
const brancheForm = ref<Branch>({
  branch_id: undefined,
  name: "",
  address: "",
  phone1: "",
  phone2: "",
  manager_id: null,
  google_map_location: "",
  is_active: true,
});

/* =====================================
   METHODS
   ===================================== */

// Fetch all branches from API
const fetchAllBranches = async () => {
  isLoading.value = true;
  try {
    allBranches.value = await branchService.getAll();
    // Set first tab as active if none selected
    const firstBranchId = allBranches.value.length ? allBranches.value[0].branch_id : null;
    if (!allBranches.value.find(b => b.branch_id === activeTab.value)) {
      activeTab.value = firstBranchId;
    }
  } catch (err) {
    console.error(err);
    toast.add({ severity: "error", summary: "Error", detail: "Failed to fetch branches", life: 3000 });
  } finally {
    isLoading.value = false;
  }
};

// Save branch (create or update)
const saveBranch = async () => {
  isSaving.value = true;
  try {
    if (isEditMode.value) {
      await branchService.update(brancheForm.value.branch_id, brancheForm.value);
      toast.add({ severity: "success", summary: "Saved", detail: "Branch updated successfully", life: 3000 });
    } else {
      await branchService.create(brancheForm.value);
      toast.add({ severity: "success", summary: "Success", detail: "New branch added", life: 3000 });
    }
    fetchAllBranches();
    addEditBranchFormDialogVisible.value = false;
  } catch (err) {
    console.error(err);
    toast.add({ severity: "error", summary: "Error", detail: "Failed to save branch", life: 3000 });
  } finally {
    isSaving.value = false;
  }
};

// Fetch all users (for manager dropdown)
const fetchAllUsers = async () => {
  try {
    allUsers.value = await UsersService.getAll();
  } catch (err) {
    console.error(err);
    toast.add({ severity: "error", summary: "Error", detail: "Failed to fetch users", life: 3000 });
  }
};

// Open Add/Edit Branch Dialog
const openAddEditBranchDialog = (branch: Branch | null = null) => {
  if (branch) {
    isEditMode.value = true;
    brancheForm.value = { ...branch, manager_id: branch.manager };
  } else {
    resetForm();
  }
  fetchAllUsers();
  addEditBranchFormDialogVisible.value = true;
};

// Confirm deletion of branch
const confirmDeleteBranch = (branch: Branch) => {
  if (isConfirming.value) return;
  isConfirming.value = true;

  confirm.require({
    message: `هل انت متاكد من حذف بيانات المركز "${branch.name}"?`,
    header: "تاكيد الحذف",
    icon: "pi pi-exclamation-triangle text-yellow-500",
    acceptLabel: "تاكيد",
    acceptIcon: "pi pi-check",
    acceptClass:"p-button-sm border border-red-500 bg-red-500 text-white",
    rejectLabel: "الغاء",
    rejectIcon: "pi pi-times",
    rejectClass:"p-button-sm border border-gray-400 text-gray-600 bg-transparent hover:bg-gray-200",
    accept: async () => {
      try {
        await branchService.delete(branch.branch_id);
        toast.add({ severity: "success", summary: "Deleted", detail: "Branch deleted successfully", life: 3000 });
        fetchAllBranches();
      } catch (err) {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to delete branch", life: 3000 });
      } finally {
        isConfirming.value = false;
      }
    },
    reject: () => (isConfirming.value = false),
  });
};

// Reset form to initial state
const resetForm = () => {
  isEditMode.value = false;
  brancheForm.value = {
    branch_id: undefined,
    name: '',
    address: '',
    phone1: '',
    phone2: '',
    manager_id: null,
    google_map_location: '',
    is_active: true,
  };
};

/* =====================================
   LIFECYCLE HOOKS
   ===================================== */
onMounted(() => {
  fetchAllBranches();
});
</script>

<style scoped>
/* ==============================
   Branch Card Styling
   ============================== */
.branchInfoCard {
  padding: 10px;
  border-radius: 25px;

  /* Gradient background with image overlay */
  background: 
    linear-gradient(to right, #354143, #62ada29c),
    url(/src/assets/others/1.jpg) no-repeat;
  background-position: left;
}
</style>
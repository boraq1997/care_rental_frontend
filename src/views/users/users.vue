<template>
    <div class="card" dir="rtl">
        <div class="card flex justify-center mt-3 mb-3">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
        </div>

        <div
            v-if="isLoading"
            class="fixed top-0 left-0 w-screen h-screen flex align-items-center justify-content-center z-5"
            style="background-color: #2828289c;"
        >
            <div class="text-primary-500 border-round text-center">
                <i class="fa-solid fa-circle-notch fa-spin fa-spin-reverse fa-2xl" style="font-size: 80px;"></i>
            </div>
        </div>

        <div class="flex justify-between mb-3">
            <Button 
                class="p-button-sm bg-teal-500" 
                label="مستخدم جديد"
                icon="fas fa-plus" 
                @click="openAddEditUserDialog()"
            />
        </div>

        <DataTable
            v-model:filters="filters"
            :value="allUsers"
            dataKey="id"
            paginator
            :rows="10"
            filterDisplay="menu"
            :globalFilterFields="['name', 'username', 'fullname']"
            responsiveLayout="scroll"
            class="text-right"
        >
            <!-- Table Header with Search -->
            <template #header>
                <div class="flex justify-between items-center">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters.global.value" placeholder="بحث شامل..." />
                    </IconField>
                </div>
            </template>

            <template #empty>
                <Message severity="warn">لم يتم العثور على مستخدمين</Message>
            </template>
            <template #loading> جاري تحميل بيانات الأقسام... </template>

            <Column field="id" sortable>
                <template #header>
                    <i class="fas fa-hashtag text-gray-500"></i>
                </template>
            </Column>

            <Column field="fullname" header="الاسم الكامل" sortable>
                <template #header>
                    <i class="fa-solid fa-user text-gray-500"></i>
                </template>
            </Column>

            <Column field="login.username" header="اسم المستخدم" sortable>
                <template #header>
                    <i class="fa-solid fa-user-tag text-gray-500"></i>
                </template>
            </Column>

            <Column field="contact.email" header="البريد الالكتروني" sortable>
                <template #header>
                    <i class="fa-solid fa-envelope text-gray-500"></i>
                </template>
            </Column>

            <Column field="contact.phone1" header="رقم الهاتف1" sortable>
                <template #header>
                    <i class="fa-solid fa-phone-flip text-gray-500"></i>
                </template>
            </Column>

            <Column field="contact.phone2" header="رقم الهاتف2" sortable>
                <template #header>
                    <i class="fa-solid fa-phone-flip text-gray-500"></i>
                </template>
            </Column>

            <Column field="contact.address" header="العنوان" sortable>
                <template #header>
                    <i class="fa-solid fa-map-location-dot text-gray-500"></i>
                </template>
            </Column>

            <Column field="role" header="نوع المستخدم" sortable>
                <template #header>
                    <i class="fa-solid fa-user-tie text-gray-500"></i>
                </template>
            </Column>

            <Column field="branch" header="المركز" sortable>
                <template #header>
                    <i class="fa-solid fa-user-tie text-gray-500"></i>
                </template>
            </Column>

            <!-- Actions Column -->
            <Column header="الادارة">
                <template #header>
                    <i class="fas fa-cogs text-gray-500"></i>
                </template>
                <template #body="{ data }">
                    <Button icon="fas fa-car" class="ml-1" severity="secondary" rounded variant="outlined" aria-label="all cars" @click="getUserVehicles(data)" />
                    <Button icon="fas fa-edit" class="ml-1" severity="secondary" rounded variant="outlined" aria-label="edit" @click="openAddEditUserDialog(data)" />
                    <Button icon="fas fa-trash-alt" severity="danger" rounded variant="outlined" aria-label="delete" @click.stop="confirmDeleteUser(data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog
            v-model:visible="addEditUserFormDialogVisible"
            :header="isEditMode ? 'تعديل بيانات المستخدم' : 'اضافة مستخدم جديد'"
            :style="{width: '30vw'}"
            modal
            @hide="resetForm"
            dir="rtl"
        >   

            <div class="flex flex-column gap-4 mt-3">
                <IconField>
                    <InputIcon class="fa-solid fa-user" />
                    <InputText v-model="userForm.fullname" placeholder="الاسم الكامل" fluid />
                </IconField>

                <IconField>
                    <InputIcon class="fa-solid fa-user-tag" />
                    <InputText v-model="userForm.username" placeholder="اسم المستخدم" fluid />
                </IconField>

                <IconField>
                    <InputIcon class="fas fa-user-lock"/>
                    <Password v-model="userForm.password" placeholder="كلمة المرور" fluid toggleMask>
                        <template #header>
                            <div class="font-semibold text-xm mb-4">صعوبة كلمة المرور</div>
                        </template>
                    </Password>
                </IconField>

                <IconField>
                    <InputIcon class="fa-solid fa-user-lock" />
                    <Password v-model="userForm.password_confirmation" placeholder="تأكيد كلمة المرور" fluid toggleMask/>
                </IconField>

                <Select
                  v-model="userForm.branch_id"
                  :options="allBranches"
                  optionLabel="name"
                  optionValue="branch_id"
                  placeholder="اختر المركز"
                  class="w-full m:w-56"
                />

                <Select 
                    v-model="userForm.role" 
                    :options="roles" 
                    filter 
                    optionLabel="name"
                    optionValue="value" 
                    placeholder="اختر نوع المستخدم" 
                    class="w-full md:w-56" 
                    />

                <IconField>
                    <InputIcon class="fa-solid fa-envelope" />
                    <InputText v-model="userForm.email" placeholder="البريد الالكتروني" fluid />
                </IconField>

                <IconField>
                    <InputIcon class="fa-solid fa-phone-flip" />
                    <InputText v-model="userForm.phone1" placeholder="رقم الهاتف1" fluid />
                </IconField>

                <IconField>
                    <InputIcon class="fa-solid fa-phone-flip" />
                    <InputText v-model="userForm.phone2" placeholder="رقم الهاتف2" fluid />
                </IconField>
            </div>

            <template #footer>
                <Button
                    @click="addEditUserFormDialogVisible = false"
                    label="الغاء"
                    icon="fas fa-times"
                    severity="secondary"
                    class="p-button-sm"
                />

                <Button
                    :label="isEditMode ? 'حفظ' : 'إضافة'"
                    icon="fas fa-floppy-disk"
                    :loading="isLoading"
                    class="p-button-sm"
                    @click="saveUser"
                />
            </template>
        </Dialog>

        <Dialog
          v-model:visible="showUserVehicles"
          header="العجلات التي يملكها المستخدم"
          :style="{width: '75vw'}"
          modal
          dir="rtl"
        >
          <DataTable
            v-model:filters="userVehiclesFilter"
            :value="allUserVehicles"
            dataKey="id"
            paginator
            :rows="10"
            filterDisplay="menu"
            :gloabalFilterFields="['name']"
            responsiveLayout="scroll"
            dir="rtl"
            >
            <template #header>
              <div class="flex justify-between items-center">
                <IconField>
                  <InputIcon>
                      <i class="pi pi-search" />
                  </InputIcon>
                  <InputText v-model="filters.global.value" placeholder="بحث شامل..." />
                </IconField>
              </div>
            </template>

            <template #empty>
                <Message severity="warn">لم يتم العثور على مستخدمين</Message>
            </template>
            <template #loading> جاري تحميل بيانات الأقسام... </template>

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

            <Column field="status" header="حالة العجلة" sortable>
              <template #header>
                <i class="fas fa-diagram-project" />
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
          </DataTable>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import Breadcrumb from "primevue/breadcrumb";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Message from 'primevue/message';
import Dialog from "primevue/dialog";
import Select from 'primevue/select';
import Password from 'primevue/password';
import Tag from "primevue/tag";

import UsersService, { type CreateUserPayload } from './usersService';
import { FilterMatchMode } from "@primevue/core/api";
import ConfirmDialog from 'primevue/confirmdialog';
import vehicleService from "../vehicles/vehicelsService";
import branchService from "../branches/branchesService";

const toast = useToast();
const confirm = useConfirm();

const allUsers = ref<any[]>([]);
const isEditMode = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);
const isConfirming = ref(false);
const addEditUserFormDialogVisible = ref(false);
const currentUserId = ref<number | null>(null);
const filters = reactive({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const showUserVehicles = ref(false);
const allUserVehicles = ref<any[]>([]);
const allBranches = ref<any[]>([]);

const userVehiclesFilter = reactive({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
});
// Breadcrumb
const breadcrumbHome = ref({ icon: "pi pi-home", to: "/" });
const breadcrumbItems = ref([
  { label: "الرئيسية", to: "/" },
  { label: "المستخدمين", to: "/departments" },
]);

const userForm = ref<CreateUserPayload>({
  fullname: '',
  role: '',
  branch_id: 0,
  username: '',
  password: '',
  password_confirmation: '',
  email: '',
  phone1: '',
  phone2: '',
});

const roles = ref([
  { name: 'مسؤول عام', value: 'super_admin' },
  { name: 'مدير مركز', value: 'branch_admin' },
  { name: 'موظف', value: 'employee' },
  { name: 'مالك', value: 'owner' },
]);

// 📦 جلب جميع المستخدمين
const fetchAllUsers = async () => {
  isLoading.value = true;
  try {
    allUsers.value = await UsersService.getAll();
  } catch (err) {
    console.error(err);
    toast.add({ severity: "error", summary: "خطأ", detail: "فشل تحميل المستخدمين", life: 3000 });
  } finally {
    isLoading.value = false;
  }
};

const getUserVehicles = async(user: any)=>{
    if (user) {
      try {
        const response = await vehicleService.getByOwner('otherOwner', user.id);
        allUserVehicles.value = response.data;
      } catch (err) {
        console.log(err);
        toast.add({
          severity: 'error',
          summary: 'رسالة خطاء',
          detail: 'حدث خطاء اثناء جلب العجلات التابعة الى القسم',
          life: 3000
        });
      } finally {
        showUserVehicles.value = true;
      }
      
    }
}

const getAllBranches = async()=>{
  try {
    const response = await branchService.getAll();
    allBranches.value = response;
    console.log(allBranches.value)
  } catch (err: any) {
    console.log(err)
    toast.add({
      severity: "error",
      summary: "رسالة خطاء",
      detail: "حدث خطاء ما اثناء جلب بيانات المراكز",
      life: 3000
    })
  }
}

const openAddEditUserDialog = (user: any = null) => {
  if (user) {
    isEditMode.value = true;
    currentUserId.value = user.id
    userForm.value = {
      fullname: user.fullname,
      role: user.role,
      branch_id: user.branch_id,
      username: user.login?.username,
      password: '',
      email: user.contact?.email,
      phone1: user.contact?.phone1,
      phone2: user.contact?.phone2,
    };
  } else {
    resetForm();
  }
  console.log(currentUserId.value)
  addEditUserFormDialogVisible.value = true;
  getAllBranches()
};

const saveUser = async () => {
  isSaving.value = true;
  try {
    if (isEditMode.value) {
      await UsersService.update(currentUserId.value, userForm.value);
      toast.add({ severity: "success", summary: "نجاح", detail: "تم تحديث المستخدم", life: 3000 });
    } else {
      await UsersService.create(userForm.value);
      toast.add({ severity: "success", summary: "نجاح", detail: "تمت إضافة المستخدم", life: 3000 });
    }
    addEditUserFormDialogVisible.value = false;
    fetchAllUsers();
  } catch (err) {
    console.error(err);
    toast.add({ severity: "error", summary: "خطأ", detail: "فشل حفظ المستخدم", life: 3000 });
  } finally {
    isSaving.value = false;
  }
};

const confirmDeleteUser = (user: any) => {
  if (isConfirming.value) return;
  isConfirming.value = true;
  confirm.require({
    message: `هل أنت متأكد من حذف بيانات المستخدم؟ "${user.fullname}"`,
    header: "تأكيد الحذف",
    icon: "pi pi-exclamation-triangle text-yellow-500",
    acceptLabel: "تأكيد",
    acceptIcon: "pi pi-check",
    acceptClass:"p-button-sm border border-red-500 bg-red-500 text-white",
    rejectLabel: "إلغاء",
    rejectIcon: "pi pi-times",
    rejectClass:"p-button-sm border border-gray-400 text-gray-600 bg-transparent hover:bg-gray-200",
    accept: async () => {
      try {
        await UsersService.delete(user.id);
        toast.add({ severity: "success", summary: "تم", detail: "تم حذف المستخدم", life: 3000 });
        fetchAllUsers();
      } catch (err) {
        toast.add({ severity: "error", summary: "خطأ", detail: "فشل حذف المستخدم", life: 3000 });
      } finally {
        isConfirming.value = false;
      }
    },
    reject: () => (isConfirming.value = false),
  });
};

const resetForm = () => {
  isEditMode.value = false;
  userForm.value = {
    fullname: '',
    role: '',
    branch_id: 0,
    username: '',
    password: '',
    password_confirmation: '',
    email: '',
    phone1: '',
    phone2: '',
  };
};

onMounted(fetchAllUsers);
</script>

<style scoped>

</style>
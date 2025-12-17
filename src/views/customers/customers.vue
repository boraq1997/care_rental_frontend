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
                label="زبون جديد"
                icon="fas fa-plus"
                @click="openAddEditCustomerDialog()"
            />
        </div>

        <DataTable
          v-model:filters="filters"
          :value="allCustomers"
          dataKey="customer_id"
          paginator
          :rows="10"
          filterDisplay="menu"
          :globalFilterFields="['']"
          responsiveLayout="scroll"
          class="text-right"
        >
          <template #header>
            <div class="flex justify-between">
              <IconField>
                <InputIcon class="fas fa-search"/>
                <InputText v-model="filters.global.value" placeholder="بحث..."/>
              </IconField>
            </div>
          </template>

          <template #empty>
            <Message severity="warn">لم يتم اضافة اي زبائن بعد</Message>
          </template>

          <Column field="customer_id" sortable>
            <template #header>
              <i class="fas fa-hashtag"/>
            </template>
          </Column>

          <Column field="fullname" sortable>
            <template #header>
              الاسم
              <i class="fas fa-user"/>
            </template>
          </Column>

          <Column field="national_id" sortable>
            <template #header>
              الهوية الشخصية
              <i class="fa-solid fa-address-card"/>
            </template>
          </Column>

          <Column field="license_number" sortable>
            <template #header>
              اجازة السوق
              <i class="fa-regular fa-id-card"></i>
            </template>
          </Column>

          <Column field="vip_level" sortable>
            <template #header>
              نوع العضوية
              <i class="fa-solid fa-medal"/>
            </template>
            <template #body="{data}">
              <Tag 
                  icon="fas fa-medal"
                  :value="vipLabel(data.vip_level)"
                  :severity="vipSeverity(data.vip_level)"
              />
            </template>
          </Column>

          <Column field="birthday" sortable>
            <template #header>
              التولد
              <i class="fas fa-calendar"/>
            </template>
          </Column>

          <Column field="contact.address" sortable>
            <template #header>
              العنوان
              <i class="fa-solid fa-map-location-dot"/>
            </template>
          </Column>

          <Column field="contact.phone1" sortable>
            رقم الهاتف الاول
            <i class="fas fa-phone-flip"/>
          </Column>

          <Column field="contact.phone2" sortable>
            رقم الهاتف الثاني
            <i class="fas fa-phone-flip"/>
          </Column>

          <Column field="contact.email" sortable>
            <template #header>
              البريد الالكتروني
              <i class="fas fa-envelope"/>
            </template>
          </Column>

          <Column>
            <template #header>
              الادارة
              <i class="fas fa-cogs"/>
            </template>
            <template #body="{data}">
              <Button
                icon="fas fa-clock-rotate-left"
                severity="secondary"
                rounded
                variant="outlined"
                class="p-button-sm ml-2 mr-2"
              />

              <Button
                icon="fas fa-pen-to-square"
                severity="secondary"
                rounded
                variant="outlined"
                class="p-button-sm ml-2 mr-2"
                @click="openAddEditCustomerDialog(data)"
              />

              <Button
                icon="fas fa-trash-alt"
                severity="danger"
                rounded
                variant="outlined"
                class="p-button-sm ml-2 mr-2"
                @click="confirmDeleteCustomer(data)"
              />
            </template>
          </Column>

          <Dialog
            v-model:visible="addEditCustomersDialogVisible"
            :header="isEditMode ? 'تعديل بيانات الزبون' : 'اضافة زبون جديد'"
            :style="{width: '30vw'}"
            modal
            @hide="resetForm"
            dir="rtl"
          >
            <div class="grid mb-3">
              <div class="col">
                <IconField>
                  <InputIcon class="fas fa-user-tie"/>
                  <InputText v-model="customerForm.fullname" placeholder="اسم الزبون" fluid/>
                </IconField>
              </div>

              <div class="col">
                <DatePicker v-model="customerForm.birthday" placeholder="التولد" showIcon fluid iconDisplay="input" dir="ltr"/>
              </div>
            </div>

            <div class="grid mb-3">
              <div class="col">
                <IconField>
                  <InputIcon class="fa-solid fa-address-card"/>
                  <InputText v-model="customerForm.national_id" placeholder="رقم الهوية الشخصية" fluid/>
                </IconField>
              </div>
              <div class="col">
                <IconField>
                  <InputIcon class="fa-regular fa-id-card"/>
                  <InputText v-model="customerForm.license_number" placeholder="رقم اجازة السوق" fluid/>
                </IconField>
              </div>
            </div>

            <Select 
              v-model="customerForm.vip_level" 
              placeholder="اختر نوع العضوية" 
              :options="[
                {name: 'ذهبية', value: 'gold'},
                {name: 'فضية', value: 'silver'},
                {name: 'برونزية', value: 'bronze'},
              ]"
              optionLabel="name"
              optionValue="value"
              fluid
              class="mb-3"
              />

              <div class="grid mb-3">
                <div class="col">
                  <IconField>
                    <InputIcon class="fas fa-envelope"/>
                    <InputText v-model="customerForm.email" placeholder="البريد الالكتروني" fluid/>
                  </IconField>
                </div>
                <div class="col">
                  <IconField>
                    <InputIcon class="fas fa-map-location-dot"/>
                    <InputText v-model="customerForm.address" placeholder="العنوان" fluid/>
                  </IconField>
                </div>
              </div>

              <div class="grid">
                <div class="col">
                  <IconField>
                    <InputIcon class="fas fa-phone-flip"/>
                    <InputMask id="basic" v-model="customerForm.phone1" mask="999_9999_9999" placeholder="رقم الهاتف الاول" fluid/>
                  </IconField>
                </div>
                <div class="col">
                  <IconField>
                    <InputIcon class="fas fa-phone-flip"/>
                    <InputMask id="basic" v-model="customerForm.phone2" mask="999_9999_9999" placeholder="رقم الهاتف الثاني" fluid/>
                  </IconField>
                </div>
              </div>

              <template #footer>
                <Button 
                  label="الغاء"
                  icon="fas fa-times"
                  severity="secondary"
                  class="p-button-sm"
                  @click="addEditCustomersDialogVisible = false"
                />
                <Button
                  :label="isEditMode ? 'حفظ' : 'إضافة'"
                  icon="fas fa-floppy-disk"
                  :loading="isSaving"
                  class="p-button-sm"
                  @click="handleSaveCustomer"
                />
              </template>
          </Dialog>

        </DataTable>
    </div>
</template>
<script lang="ts" setup>
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
import UsersService, { type CreateUserPayload } from './usersService';
import { FilterMatchMode } from "@primevue/core/api";
import vehicleService from "../vehicles/vehicelsService";
import customersService from "./customersService";
import Tag from 'primevue/tag';
import DatePicker from 'primevue/datepicker';
import InputMask from 'primevue/inputmask';

const toast = useToast();
const confirm = useConfirm();

const allCustomers = ref<any[]>([]);
const isEditMode = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);
const isConfirming = ref(false); // Prevents double confirmation clicks

const filters = reactive({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const addEditCustomersDialogVisible = ref(false);
const customerLogDialogVisible = ref(false);

const breadcrumbHome = ref({ icon: "fas fa-home", to: "/" });
const breadcrumbItems = ref([
  { label: "الرئيسية", to: "/" },
  { label: "المستخدمين", to: "/departments" },
]);

const customerId = ref<number|null>(null);
const customerLog = ref<any[]>([]);

const customerForm = reactive({
  fullname: "",
  national_id: null,
  birthday: null,
  license_number: null,
  vip_level: "bronze",

  email: null,
  phone1: null,
  phone2: null,
  address: null,
});

const buildPayload = (): CreateOrUpdateCustomerPayload => {
  return {
    fullname: customerForm.fullname,
    national_id: customerForm.national_id,
    birthday: customerForm.birthday ? customerForm.birthday.toISOString().split("T")[0] : null,
    license_number: customerForm.license_number,
    vip_level: customerForm.vip_level,

    email: customerForm.email,
    phone1: customerForm.phone1,
    phone2: customerForm.phone2,
    address: customerForm.address,
  };
};

const fetchAllCustomers = async()=>{
  isLoading.value = true;
  try {
    const response = await customersService.getAll();
    allCustomers.value = response;
  } catch (err: any) {
    console.log(err);
    toast.add({
      severity: 'error',
      summary: 'رسالة خطاء',
      detail: 'عذرا حدث خطاء اثناء جلب بيانات الزبائن',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
}

const openAddEditCustomerDialog = (customer: any | null = null) => {
  if (customer) {
    isEditMode.value = true;
    customerId.value = customer.customer_id;

    customerForm.fullname = customer.fullname;
    customerForm.national_id = customer.national_id;
    customerForm.birthday = customer.birthday ? new Date(customer.birthday) : null;
    customerForm.license_number = customer.license_number;
    customerForm.vip_level = customer.vip_level;

    customerForm.email = customer.contact?.email || null;
    customerForm.phone1 = customer.contact?.phone1 || null;
    customerForm.phone2 = customer.contact?.phone2 || null;
    customerForm.address = customer.contact?.address || null;
  } else {
    resetForm();
  }

  addEditCustomersDialogVisible.value = true;
}

const handleSaveCustomer = async () => {
  isSaving.value = true;

  try {
    const payload = buildPayload();

    if (isEditMode.value && customerId.value) {
      await customersService.update(customerId.value, payload);

      toast.add({
        severity: 'success',
        summary: 'تم التعديل',
        detail: 'تم تعديل بيانات الزبون بنجاح',
        life: 3000
      });

    } else {
      await customersService.create(payload);

      toast.add({
        severity: 'success',
        summary: 'تمت الاضافة',
        detail: 'تم إضافة زبون جديد',
        life: 3000
      });
    }

    addEditCustomersDialogVisible.value = false;
    resetForm();
    fetchAllCustomers();

  } catch (err: any) {
    console.log(err);
    toast.add({
      severity: 'error',
      summary: 'خطاء',
      detail: 'حدث خطأ أثناء حفظ البيانات',
      life: 3000
    });
  } finally {
    isSaving.value = false;
  }
};

const confirmDeleteCustomer = (customer: any)=> {
  if (isConfirming.value) return;
  isConfirming.value = true;

  confirm.require({
    header: 'تاكيد الحذف',
    message: `هل انت متاكد من حذف بيانات الزبون  ${customer.fullname}`,
    icon: "pi pi-exclamation-triangle text-yellow-500",
    acceptLabel: "تاكيد",
    acceptClass: "p-button-sm border border-red-500 bg-red-500 text-white",
    rejectLabel: "الغاء",
    rejectClass: "p-button-sm border border-gray-400 text-gray-600 bg-transparent hover:bg-gray-200",
    accept: async()=>{
      try {
        await customersService.delete(customer.customer_id);
        toast.add({severity: 'success', summary: 'رسالة نجاح', detail: 'تم حذف بيانات الزبون بنجاح', life: 3000});
      } catch (err: any) {
        console.log(err)
        toast.add({ severity: "error", summary: "رسالة خطاء", detail: "حدث خطاء ما اثناء حذف بيانات الزبون", life: 3000 });
      } finally {
        isConfirming.value = false;
        fetchAllCustomers();
      }
    },
    reject: ()=>(isConfirming.value = false),
  })
}

const openCustomerLogDialog = async(customer: any)=>{
  if (!customer) return;
  
}


const vipLabel = (level: string) => {
    switch (level) {
        case "gold":
        return "ذهبية";
        case "silver":
        return "فضية";
        case "bronze":
        return "برونزية";
        default:
        return level;
    }
};

const vipSeverity = (level: string) => {
    switch (level) {
        case "gold":
            return "warning"; // لون ذهبي
        case "silver":
            return "secondary"; // رمادي/فضي
        case "bronze":
            return "help"; // برونزي/بني
        default:
            return "info";
    }
};

function resetForm() {
  customerForm.fullname = "";
  customerForm.national_id = null;
  customerForm.birthday = null;
  customerForm.license_number = null;
  customerForm.vip_level = "bronze";

  customerForm.email = null;
  customerForm.phone1 = null;
  customerForm.phone2 = null;
  customerForm.address = null;
}

onMounted(()=> {
  fetchAllCustomers();
})
</script>
<style scoped>

</style>
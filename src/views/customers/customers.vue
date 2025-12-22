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
              <i class="fas fa-hashtag text-gray-500"/>
            </template>
          </Column>

          <Column field="fullname" sortable>
            <template #header>
              <i class="fas fa-user text-gray-500"/>
              الاسم
            </template>
          </Column>

          <Column field="national_id" sortable>
            <template #header>
              <i class="fa-solid fa-address-card text-gray-500"/>
              الهوية الشخصية
            </template>
          </Column>

          <Column field="license_number" sortable>
            <template #header>
              <i class="fa-regular fa-id-card text-gray-500"></i>
              اجازة السوق
            </template>
          </Column>

          <Column field="vip_level" sortable>
            <template #header>
              <i class="fa-solid fa-medal text-gray-500"/>
              نوع العضوية
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
              <i class="fas fa-calendar text-gray-500"/>
              التولد
            </template>
          </Column>

          <Column field="contact.address" sortable>
            <template #header>
              <i class="fa-solid fa-map-location-dot text-gray-500"/>
              العنوان
            </template>
          </Column>

          <Column field="contact.phone1" sortable>
            <template #header>
              <i class="fas fa-phone-flip text-gray-500"/>
               رقم الهاتف الاول
            </template>
          </Column>

          <Column field="contact.phone2" sortable>
            <template #header>
              <i class="fas fa-phone-flip text-gray-500"/>
              رقم الهاتف الثاني
            </template>
          </Column>

          <Column field="contact.email" sortable>
            <template #header>
              <i class="fas fa-envelope text-gray-500"/>
              البريد الالكتروني
            </template>
          </Column>

          <Column>
            <template #header>
              <i class="fas fa-cogs text-gray-500"/>
              الادارة
            </template>
            <template #body="{data}">
              <Button
                icon="fas fa-clock-rotate-left"
                severity="secondary"
                rounded
                variant="outlined"
                class="p-button-sm ml-2 mr-2"
                @click="openCustomerLogDialog(data)"
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

        </DataTable>

        <Dialog
            v-model:visible="addEditCustomersDialogVisible"
            :header="isEditMode ? 'تعديل بيانات الزبون' : 'اضافة زبون جديد'"
            :style="{width: '30vw'}"
            modal
            @hide="resetForm"
            dir="rtl"
          >
            <div class="grid mb-3 mt-3">
              <div class="col">
                <FloatLabel variant="on">
                  <label for="fullname_feild" class="font-semibold mb-2 block"><i class="fas fa-user-tie"/> اسم الزبون</label>
                  <InputText id="fullname_feild" v-model="customerForm.fullname" fluid/>
                </FloatLabel>
              </div>

              <div class="col">
                <FloatLabel variant="on">
                  <DatePicker id="birthday_feild" v-model="customerForm.birthday" showIcon fluid iconDisplay="input" dir="ltr"/>
                  <label for="birthday_feild" class="font-semibold mb-2 block"><i class="fas fa-calendar-alt"/> التولد</label>
                </FloatLabel>
              </div>
            </div>

            <div class="grid mb-3">
              <div class="col">
                <FloatLabel variant="on">
                  <InputText v-model="customerForm.national_id" fluid/>
                  <label for="national_id_feild" class="font-semibold mb-2 block"><i class="fa-solid fa-address-card"/> رقم الهوية الشخصية</label>
                </FloatLabel>
              </div>
              <div class="col">
                <FloatLabel>
                  <InputText id="license_number_feild" v-model="customerForm.license_number" fluid/>
                  <label for="license_number_feild" class="font-semibold mb-2 block"><i class="fas fa-id-card"/> رقم اجازة السوق</label>
                </FloatLabel>
              </div>
            </div>

            <FloatLabel variant="on">
              <Select 
                id="vip_level_feild"
                v-model="customerForm.vip_level" 
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
              <label for="vip_level_feild" class="font-semibold mb-2 block">نوع العضوية</label>
            </FloatLabel>
            

              <div class="grid mb-3">
                <div class="col">
                  <FloatLabel variant="on">
                    <InputText id="email_feild" v-model="customerForm.email" fluid/>
                    <label for="email_feild" class="font-semibold mb-2 block"><i class="fas fa-envelope"/> البريد الالكتروني</label>
                  </FloatLabel>
                </div>
                <div class="col">
                  <FloatLabel>
                    <InputText id="address_feild" v-model="customerForm.address" fluid/>
                    <label for="address_feild" class="font-semibold mb-2 block"><i class="fas fa-map-location-dot"/> العنوان</label>
                  </FloatLabel>
                </div>
              </div>

              <div class="grid">
                <div class="col">
                  <FloatLabel variant="on">
                    <InputMask id="basic phone1_feild" v-model="customerForm.phone1" mask="999_9999_9999" fluid/>
                    <label for="phone1_feild" class="font-semibold mb-2 block"><i class="fas fa-phone-flip"/> رقم الهاتف الاول</label>
                  </FloatLabel>
                </div>
                <div class="col">
                  <FloatLabel variant="on">
                    <InputMask id="basic phone2_feild" v-model="customerForm.phone2" mask="999_9999_9999" fluid/>
                    <label for="phone1_feild" class="font-semibold mb-2 block"><i class="fas fa-phone-flip"/> رقم الهاتف الثاني</label>
                  </FloatLabel>
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

        <Dialog
          v-model:visible="customerHistoryDialogVisible"
          header="جميع الحجوزات السابقة للمستخدم"
          :style="{width: '75vw'}"
          modal
          dir="rtl"
          @hide="customerLog = []"
          maximizable
        >
          <DataTable
            v-model:filters="customerLogFilters"
            v-model:expandedRows="expandedRows"
            :value="customerLog"
            dataKey="rental_id"
            paginator
            :rows="10"
            filterDisplay="menu"
            :globalFilterFields="['']"
            responsiveLayout="scroll"
            class="text-right"
            tableStyle="min-width: 60rem"
          >
            <template #header>
              <div class="flex justify-between">
                <FloatLabel variant="on">
                  <InputText id="customerLogFilterFeild" v-model="customerLogFilters.global.value"/>
                  <label for="customerLogFilterFeild"><i class="fas fa-search"/> بحث...</label>
                </FloatLabel>
              </div>
            </template>

            <template #empty>
              <Message severity="warn">لم يتم اضافة اي عمليات تاجير لهذا الزبون</Message>
            </template>

            <Column expander style="width: 5rem;"/>

            <Column field="rental_id" sortable>
              <template #header>
                <i class="fas fa-hashtag"/>
              </template>
            </Column>

            <Column feild="start_date" sortable>
              <template #header>
                <i class="fas fa-calendar-alt"/>
                تاريخ الحجز
              </template>
            </Column>

            <Column field="price_per_unit">
              <template #header>
                <i class="fas fa-dollar-sign text-gray-500"/>
                سعر الوحدة
              </template>
            </Column>

            <Column field="total_price">
              <template #header>
                <i class="fas fa-dollar text-gray-500"/>
                السعر الكلي
              </template>
            </Column>

            <Column field="rental_type">
              <template #header>
                <i class="fas fa-home text-gray-500"/>
                نوع الحجز
              </template>
            </Column>

            <Column field="status">
              <tempate #header>
                <i class="fas fa-home text-gray-500"/>
                حالة الحجز
              </tempate>
            </Column>            

            <template #expansion="slotProps">
              <div class="">
                <h5 class="m-0 mt-3">تفاصيل الفرع</h5>
                <DataTable :value="[slotProps.data.branch]">
                  <Column field="branch_id">
                    <template #header>
                      <i class="fas fa-hashtag text-gray-500"/>
                    </template>
                  </Column>

                  <Column field="name">
                    <template #header>
                      <i class="fas fa-home text-gray-500"/>
                      اسم الفرع
                    </template>
                  </Column>

                  <Column field="address">
                    <template #header>
                      <i class="fas fa-map-location-dot text-gray-500"/>
                      عنوان الفرع
                    </template>
                  </Column>

                  <Column field="phone1">
                    <template #header>
                      <i class="fas fa-phone-flip text-gray-500"/>
                      رقم الهاتف
                    </template>
                  </Column>

                  <Column field="is_active">
                    <template #header>
                      <i class="fas fa-home text-gray-500"/>
                      الحالة
                    </template>
                    <template #body="{data}">
                      <Tag
                        :value="data.is_active == 1 ? 'مفعل' : 'معطل'"
                        :severity="data.is_active == 1 ? 'success' : 'danger'"
                      />
                    </template>
                  </Column>

                  <Column field="manager.fullname">
                    <template #header>
                      <i class="fas fa-user-tie text-gray-500"/>
                      مدير الفرع
                    </template>
                  </Column>
                </DataTable>

                <h5 class="m-0 mt-3">تفاصيل العجلة</h5>
                <DataTable :value="[slotProps.data.vehicle]">
                  <Column field="vehicle_id">
                    <template #header>
                      <i class="fas fa-hashtag text-gray-500"/>
                    </template>
                  </Column>

                  <Column field="brand" header="الماركة" sortable>
                    <template #header>
                      <i class="fa-solid fa-car-side text-gray-500"></i>
                    </template>
                  </Column>

                  <Column field="year" header="سنة الصنع" sortable>
                    <template #header>
                      <i class="fa-solid fa-calendar-week text-gray-500"></i>
                    </template>
                  </Column>

                  <Column field="color">
                    <template #header>
                      <i class="fas fa-brush text-gray-500"/>
                      اللون
                    </template>
                  </Column>

                  <Column field="model" header="الموديل" sortable>
                    <template #header>
                      <i class="fa-solid fa-car-side text-gray-500"></i>
                    </template>
                  </Column>

                  <Column field="plate_number" header="رقم اللوحة" sortable>
                    <template #header>
                      <i class="fa-solid fa-id-card text-gray-500"></i>
                    </template>
                  </Column>

                  <Column field="owner_type">
                    <template #header>
                      <i class="fa-solid fa-users-viewfinder text-gray-500" />
                      نوع المالك
                    </template>
                    <template #body="{ data }">
                      <Tag v-if="data.owner_type === 'branche'" icon="fas fa-shop" severity="warn" value="المركز" />
                      <Tag v-if="data.owner_type === 'otherOwner'" icon="fas fa-user" severity="info" value="مستثمر" />
                    </template>
                  </Column>
                </DataTable>

                <h5 class="m-0 mt-3">تم العقد بواسطة</h5>
                <DataTable :value="[slotProps.data.created_by]">
                  <Column field="user_id">
                    <template #header>
                      <i class="fas fa-hashtag text-gray-500"/>
                    </template>
                  </Column>

                  <Column field="fullname" header="الاسم الكامل" sortable>
                    <template #header>
                        <i class="fa-solid fa-user text-gray-500"></i>
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
                </DataTable>
              </div>
            </template>
          </DataTable>

        </Dialog>
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
import FloatLabel from 'primevue/floatlabel';

const toast = useToast();
const confirm = useConfirm();

const allCustomers = ref<any[]>([]);
const isEditMode = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);
const isConfirming = ref(false); // Prevents double confirmation clicks
const expandedRows = ref();

const filters = reactive({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const customerLogFilters = reactive({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
})

const addEditCustomersDialogVisible = ref(false);
const customerHistoryDialogVisible = ref(false)

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
  try {
    const response = await customersService.getCustomerRentals(customer.customer_id);
    customerLog.value = response.data;
    customerHistoryDialogVisible.value = true
  } catch (err: any) {
    console.log(err);
    toast.add({
      severity: "error",
      summary: "رسالة خطاء",
      detail: "حدث خطاء ما اثناء جلب تاريخ الزبون",
      life: 3000
    });
  }
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
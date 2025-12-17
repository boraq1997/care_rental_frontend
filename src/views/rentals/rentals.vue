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
                label="اضافة حجز"
                icon="fas fa-plus"
                @click="openAddEditRentalDialog()"
            />
        </div>

        <div class="grid">
            <div class="col-12 sm:col-6 lg:col-4 xl:col-3" v-for="rental in allRentals">
                <Card class="booking-card">
                    
                    <template #content>
                        <div class="p-0">
                            
                            <!-- Header: Booking Number & Status -->
                            <div class="flex align-items-center justify-content-between mb-3">
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-hashtag text-700"></i>
                                <span class="text-lg font-bold text-900">{{ rental.vehicle.plate_number }}</span>
                            </div>
                            <Tag severity="danger" value="ملغي" />
                            </div>

                            <!-- Vehicle & Booking Number -->
                            <div class="surface-100 border-round p-3 mb-3">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                <div class="text-xs text-600 mb-1"><i class="fas fa-car"/>المركبة</div>
                                <div class="font-bold text-900">{{ rental.vehicle.brand }} | {{ rental.vehicle.model }}</div>
                                </div>
                                <div class="text-left">
                                <div class="text-xs text-600 mb-1">رقم الحجز</div>
                                <div class="font-bold text-primary">#{{ rental.rental_id }}</div>
                                </div>
                            </div>
                            </div>

                            <!-- Customer Name -->
                            <div class="flex align-items-center gap-2 mb-3 pb-3 border-bottom-1 surface-border">
                            <i class="pi pi-user text-600"></i>
                            <span class="text-sm text-600">العميل:</span>
                            <span class="text-sm font-semibold text-900">{{ rental.customer.fullname }}</span>
                            </div>

                            <!-- Dates -->
                            <div class="grid mb-3">
                            <div class="col-6">
                                <div class="text-xs text-600 mb-2">
                                <i class="pi pi-calendar text-green-600 ml-1"></i>
                                تاريخ البدء
                                </div>
                                <div class="font-bold text-900">{{ rental.start_date }}</div>
                            </div>
                            <div class="col-6">
                                <div class="text-xs text-600 mb-2">
                                <i class="pi pi-calendar text-orange-600 ml-1"></i>
                                تاريخ الانتهاء
                                </div>
                                <div class="font-bold text-900">{{ rental.end_date }}</div>
                            </div>
                            </div>

                            <!-- Total Price -->
                            <div class="surface-50 border-round p-3 mb-3">
                            <div class="flex align-items-center justify-content-between">
                                <span class="text-sm text-700">الإجمالي</span>
                                <span class="text-xl font-bold text-green-600">{{ rental.total_price }} د.ع</span>
                            </div>
                            </div>

                            <!-- Footer: Created Date & Action -->
                            <div class="flex align-items-center justify-content-between pt-2">
                            <span class="text-xs text-500">
                                <i class="pi pi-clock ml-1"></i>
                                {{ rental.created_at }}
                            </span>
                            <Button 
                                label="التفاصيل" 
                                icon="pi pi-arrow-left" 
                                text
                                size="small"
                                @click="showRentalInfo(rental)"
                            />
                            </div>

                        </div>
                    </template>

                </Card>
            </div>
        </div>

        <Dialog
            v-model:visible="addEditRentalDialogVisible"
            :header="isEditMode ? 'تعديل بيانات الحجز' : 'اضافة حجز جديد'"
            :style="{width: '30vw'}"
            modal
            @hide="resetForm"
            dir="rtl"
        >
        <div class="grid">
            <div class="col">
                <Select
                    v-model="rentalForm.vehicle_id"
                    :options="allVehicles"
                    optionLabel="brand"
                    optionValue="vehicle_id"
                    placeholder="اختر العجلة"
                    filter
                    class="w-full"
                >
                    <template #value="{ value }">
                        <span v-if="!selectedVehicle" class="text-500">اختر العجلة</span>

                        <div v-else class="flex align-items-center gap-2">
                            <i class="fas fa-car text-primary"></i>
                            <div>
                                <p class="m-0 font-bold"> {{ selectedVehicle.model }}</p>
                            </div>
                        </div>
                    </template>

                    <!-- الخيارات -->
                    <template #option="{ option }">
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-car text-primary"></i>
                            <div>
                                <p class="m-0 font-semibold">{{ option.brand }} {{ option.model }}</p>
                                <span class="text-xs">{{ option.plate_number }}</span>
                            </div>
                        </div>
                    </template>
                </Select>
            </div>
            <div class="col">
                <div class="grid">
                    <div class="col">
                        <Select 
                            v-model="rentalForm.customer_id"
                            :options="allCustomers"
                            optionLabel="fullname"
                            optionValue="customer_id"
                            placeholder="اختر الزبون"
                            filter
                            class="w-full"
                        >
                            <template #value="{ value }">
                                <span v-if="!selectedCustomer" class="text-500">اختر الزبون</span>

                                <div v-else class="flex align-items-center gap-2">
                                    <i class="fas fa-user-tie text-primary"/>
                                    <div>
                                        <p class="m-0 font-bold">{{ selectedCustomer.fullname }}</p>
                                        
                                    </div>
                                </div>
                            </template>

                            <template #option="{ option }">
                                <div class="flex align-items-center gap-2">
                                    <i class="fas fa-user-tie text-primary"></i>
                                    <div>
                                        <p class="m-0 font-semibold">
                                            {{ option.fullname }} ({{ option.vip_level }})
                                        </p>
                                        <span class="text-xs">{{ option.contact?.address }}</span>
                                    </div>
                                </div>
                            </template>
                        </Select>
                        <Message severity="warn" size="small" variant="simple"> في حال لم يكن موجود، قم بإضافته</Message>
                    </div>
                    <div class="col-2">
                        <Button v-if="!isAddingNewCustomer" icon="fas fa-plus" aria-label="Save" @click="isAddingNewCustomer = true"/>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isAddingNewCustomer" class="mt-3 mb-3 p-3 bprder-round surface-50">
            <h4 class="mb-3">إضافة زبون جديد</h4>

            <div class="grid">
                <div class="col">
                    <IconField>
                        <InputIcon class="fas fa-user-tie"/>
                        <InputText v-model="newCustomerForm.fullname" class="w-full" placeholder="اسم الزبون"/>
                    </IconField>
                </div>
                <div class="col">
                    <DatePicker v-model="newCustomerForm.birthday" placeholder="التولد" showIcon fluid icon="fas fa-calendar" dir="ltr"/>
                </div>
            </div>

            <div class="grid mb-3">
              <div class="col">
                <IconField>
                  <InputIcon class="fa-solid fa-address-card"/>
                  <InputText v-model="newCustomerForm.national_id" placeholder="رقم الهوية الشخصية" fluid/>
                </IconField>
              </div>
              <div class="col">
                <IconField>
                  <InputIcon class="fa-regular fa-id-card"/>
                  <InputText v-model="newCustomerForm.license_number" placeholder="رقم اجازة السوق" fluid/>
                </IconField>
              </div>
            </div>

            <Select 
              v-model="newCustomerForm.vip_level" 
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
                        <InputText v-model="newCustomerForm.email" placeholder="البريد الالكتروني" fluid/>
                    </IconField>
                </div>
                <div class="col">
                    <IconField>
                        <InputIcon class="fas fa-map-location-dot"/>
                        <InputText v-model="newCustomerForm.address" placeholder="العنوان" fluid/>
                    </IconField>
                </div>
              </div>

              <div class="grid">
                <div class="col">
                    <IconField>
                        <InputIcon class="fas fa-phone-flip"/>
                        <InputMask id="basic" v-model="newCustomerForm.phone1" mask="999_9999_9999" placeholder="رقم الهاتف الاول" fluid/>
                    </IconField>
                </div>
                <div class="col">
                    <IconField>
                        <InputIcon class="fas fa-phone-flip"/>
                        <InputMask id="basic" v-model="newCustomerForm.phone2" mask="999_9999_9999" placeholder="رقم الهاتف الثاني" fluid/>
                    </IconField>
                </div>
              </div>

              <div class="flex justify-content-end gap-2 mt-3">
                <Button
                    label="الغاء"
                    class="p-button-secondary p-button-sm"
                    @click="cancelAddCustomer"
                />
                <Button
                    label="اضافة"
                    icon="fas fa-check"
                    class="p-button-sm p-button-success"
                    :loading="isSaving"
                    @click="saveNewCustomer"
                />    
              </div>

        </div>

        <div class="grid mb-3">
            <div class="col">
                <DatePicker 
                    id="datepicker-12h" 
                    v-model="rentalForm.start_date" 
                    showTime 
                    hourFormat="12" 
                    showIcon 
                    iconDisplay="input"
                    :minDate="minDate"
                    placeholder="تاريخ ووقت الحجز" 
                    fluid />
            </div>
            <div class="col">
                <DatePicker 
                    id="datepicker-12h" 
                    v-model="rentalForm.end_date" 
                    showTime 
                    hourFormat="12" 
                    showIcon 
                    iconDisplay="input"
                    :minDate="rentalForm.start_date || minDate"
                    placeholder="تاريخ ووقت الانتهاء" 
                    fluid 
                />
            </div>
        </div>

        <div class="grid mb-3">
            <div class="col">
                <Select
                    v-model="rentalForm.rental_type"
                    :options="[
                        {name: 'ساعات', value: 'hours'},
                        {name: 'كيلومتر', value: 'kilometers'},
                    ]"
                    optionLabel="name"
                    optionValue="value"
                    placeholder="اختر نوع الحجو"
                    class="w-full"
                />
            </div>
            <div class="col">
                <IconField>
                    <InputIcon class="fas fa-sack-dollar"/>
                    <InputNumber v-model="rentalForm.price_per_unit" inputId="currency-us" mode="currency" placeholder="المبلغ للوحدة" currency="USD" locale="en-US" fluid />
                </IconField>
            </div>
        </div>

        <div class="grid mt-3">
            <div class="col">
                <IconField>
                    <InputIcon class="fas fa-gas-pump"/>
                    <InputNumber v-model="rentalForm.fuel_start" placeholder="كمية الوقود الحالية" fluid/>
                </IconField>
            </div>
            <div class="col">
                <IconField>
                    <InputIcon class="fas fa-gauge"/>
                    <InputNumber v-model="rentalForm.odometer_start" placeholder="عداد الكيلومتر الحالي" fluid/>
                </IconField>
            </div>
        </div>

        <template #footer>
            <Button
                label="الغاء"
                icon="fas fa-times"
                severity="secondary"
                class="p-button-sm"
                @click="addEditRentalDialogVisible = false"
            />
            <Button
                :label="isEditMode ? 'حفظ' : 'إضافة'"
                icon="fas fa-floppy-disk"
                :loading="isSaving"
                class="p-button-sm"
                @click="saveNewRental()"
            />
        </template>
        
        </Dialog>

<Drawer
    v-model:visible="rentalInformationDrawerVisible"
    position="right"
    header="تفاصيل عقد الإيجار"
    style="width: 65rem !important"

>
    <template #header>
        <div class="flex gap-2">
            <Button label="الغاء الحجز" icon="fas fa-power-off" severity="danger"  @click="showCancelRentalDialog(rental)"/>
            <Button label="تعديل" icon="fas fa-file-pen" severity="secondary"  @click="openAddEditRentalDialog(rental)" />
            <Button label="انهاء الحجز" icon="fas fa-square-check" severity="info" @click="showCompleteRentalDialog(rental)" />
        </div>
    </template>

    <div v-if="rental" class="p-3">

        <Timeline :value="timelineItems" align="alternate" class="customized-timeline" dir="ltr">

            <!-- MARKER -->
            <template #marker="slotProps">
                <span
                    class="flex align-items-center justify-content-center w-3rem h-3rem text-white border-circle shadow-2"
                    :style="{ backgroundColor: slotProps.item.color }"
                >
                    <i :class="slotProps.item.icon"></i>
                </span>
            </template>

            <!-- CONTENT -->
            <template #content="slotProps">
                <Card class="mt-3 shadow-1 border-round-lg">
                    <template #title>
                        <span class="text-xl font-bold">{{ slotProps.item.title }}</span>
                    </template>

                    <template #subtitle>
                        <span class="text-sm text-color-secondary">{{ slotProps.item.subtitle }}</span>
                    </template>

                    <template #content>
                        <div v-html="slotProps.item.body"></div>
                    </template>
                </Card>
            </template>

        </Timeline>
    </div>

    <div v-else class="p-4 text-center">
        <i class="pi pi-info-circle text-3xl mb-2"></i>
        <p>لا توجد بيانات لعرضها</p>
    </div>

</Drawer>

    <Dialog
        v-model:visible="cancelRentalDialogVisible"
        header="الغاء الحجز"
        :style="{width: '30vw'}"
        modal
        dir="rtl"
    >
        <template #header>
            الغاء الحجز
        </template>
        <Textarea v-model="cancelReson" id="on_label" rows="5" cols="30" style="resize: none" fluid/>
        <template #footer>
            <Button label="الغاء" icon="fas fa-times" severity="secondary" class="p-button-sm" @click="cancelRentalDialogVisible = false"/>
            <Button label="تاكيد" icon="fas fa-check" severity="success" class="p-button-sm" @click="showConfirmRental(rental)" />
        </template>
    </Dialog>

    <Dialog
        v-model:visible="completeRentalDialogVisible"
        header="انهاء الحجز"
        :style="{width: '30vw'}"
        modal
        dir="rtl"
    >
        <IconField class="mb-4">
            <InputIcon class="fa-solid fa-gas-pump"/>
            <InputNumber v-model="completeForm.fuel_end" placeholder="كمية الوقود" inputId="integeronly" fluid />
        </IconField>

        <IconField>
            <InputIcon class="fa-solid fa-gas-pump"/>
            <InputNumber v-model="completeForm.odometer_end" placeholder="عداد الكيلو متر" fluid/>
        </IconField>

        <template #footer>
            <Button
                label="الغاء"
                icon="fas fa-times"
                class="p-button-sm"
                severity="secondary"
                @click="completeRentalDialogVisible = false"
            />

            <Button
                label="حفظ"
                icon="fas fa-floppy-disk"
                class="p-button-sm"
                severity="success"
                @click="completeRental()"
            />
        </template>
    </Dialog>
        
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import Breadcrumb from "primevue/breadcrumb";
import Button from "primevue/button";
import rentalService, { type RentalPayload } from "./rentalService";
import Card from 'primevue/card';
import Drawer from 'primevue/drawer';
import Dialog from "primevue/dialog";
import vehicleService from "../vehicles/vehicelsService";
import customersService from "../customers/customersService";
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Message from 'primevue/message';
import DatePicker from 'primevue/datepicker';
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import Timeline from 'primevue/timeline';
import Textarea from 'primevue/textarea';



const toast = useToast();
const confirm = useConfirm();

const addEditRentalDialogVisible = ref(false)
const rentalInformationDrawerVisible = ref(false)
const completeRentalDialogVisible = ref(false);

const selectedRentalInformation = ref<any[]>([]);
const cancelRentalDialogVisible = ref(false);
const cancelReson = ref('');

const allRentals = ref<any[]>([]);
const allCustomers = ref<any[]>([]);
const allVehicles = ref<any[]>([]);

const isEditMode = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const isSaving = ref<boolean>(false);
const isConfirming = ref<boolean>(false);
const isAddingNewCustomer = ref<boolean>(false);

const minDate = ref(new Date());

const breadcrumbHome = ref({ icon: "fas fa-home", to: "/" });
const breadcrumbItems = ref([
  { label: "الرئيسية", to: "/" },
  { label: "عمليات البيع", to: "/rentals" },
]);

const rentalId = ref<number|null>(null);
const rentalForm = reactive({
  vehicle_id: null as number | null,
  customer_id: null as number | null,
  start_date: null as Date | null,
  end_date: null as Date | null,
  rental_type: "hours" as "hours" | "kilometers",
  limit_value: null,
  price_per_unit: 0,
  fuel_start: null,
  odometer_start: null,
  created_by: null,
});

const newCustomerForm = reactive({
    fullname: "",
    national_id: "",
    birthday: "",
    license_number: "",
    vip_level: "bronze",
    email: "",
    phone1: "",
    phone2: "",
    address: "",
});

const completeForm = reactive({
    fuel_end: null as number | null,
    odometer_end: null as number | null,
})

const cancelAddCustomer = ()=>{
    isAddingNewCustomer.value = false;
    newCustomerForm.fullname = "";
    newCustomerForm.national_id = "";
    newCustomerForm.birthday = "";
    newCustomerForm.license_number = "";
    newCustomerForm.vip_level = "bronze";
    newCustomerForm.email = "";
    newCustomerForm.phone1 = "";
    newCustomerForm.phone2 = "";
    newCustomerForm.address = "";
}

const resetForm = () => {
  rentalForm.vehicle_id = 0;
  rentalForm.customer_id = 0;
  rentalForm.start_date = null;
  rentalForm.end_date = null;
  rentalForm.rental_type = "hours";
  rentalForm.limit_value = null;
  rentalForm.price_per_unit = 0;
  rentalForm.fuel_start = null;
  rentalForm.odometer_start = null;
  rentalForm.created_by = null;

  isEditMode.value = false;
};

const fetchAllRentals = async()=>{
    isLoading.value = true
    try {
        const response = await rentalService.getAll();
        allRentals.value = response;
        console.log(allRentals.value)
    } catch (err: any) {
        console.log(err);
        toast.add({
            severity: 'error',
            summary: 'رسالة خطاء',
            detail: 'حدث خطاء ما اثناء جلب بيانات الحجوزات',
            life: 3000,
        });
    } finally {
        isLoading.value = false;
    }
}

const fetchAllCustomers = async()=>{
    try {
        const response = await customersService.getAll()
        allCustomers.value = response;
    } catch(err: any) {
        console.log(err)
        toast.add({
            severity: "error",
            summary: "رسالة خطاء",
            detail: "حدث خطاء اثناء جلب بيانات الزبائن",
            life: 3000
        });
    }
}

const fetchAllVehicles = async()=>{
    try {
        const response = await vehicleService.getAll();
        allVehicles.value = response.data;
        console.log(allVehicles.value)
    } catch (err: any) {
        console.log(err)
        toast.add({
            severity: "error",
            summary: "رسالة خطاء",
            detail: "حدث خطاء اثناء جلب بيانات العجلات",
            life: 3000
        });
    }
}

const openAddEditRentalDialog = (rental:any | null = null)=>{
    fetchAllCustomers();
    fetchAllVehicles();
    if (rental) {
        
        isEditMode.value = true;
        rentalId.value = rental.rental_id;

        rentalForm.vehicle_id = rental.vehicle?.vehicle_id ?? null;
        rentalForm.customer_id = rental.customer?.customer_id ?? null;
        rentalForm.start_date = rental.start_date ? new Date(rental.start_date.replace(" ", "T")) : "";
        rentalForm.end_date = rental.end_date ? new Date(rental.end_date.replace(" ", "T")) : "";
        rentalForm.rental_type = rental.rental_type ?? "hours";
        rentalForm.limit_value = rental.limit_value ?? null;
        rentalForm.price_per_unit = rental.price_per_unit ?? 0;
        rentalForm.fuel_start = rental.fuel_start ?? null;
        rentalForm.odometer_start = rental.odometer_start ?? null;
        rentalForm.created_by = rental.created_by?.user_id ?? null;
    } else {
        resetForm();
    }
    addEditRentalDialogVisible.value = true;
}

const saveNewRental = async()=>{
    isSaving.value = true;
    try {
        const payload: RentalPayload = {
            vehicle_id: rentalForm.vehicle_id ?? 0,
            customer_id: rentalForm.customer_id ?? 0,
            start_date: toLocalISO(rentalForm.start_date),
            end_date: toLocalISO(rentalForm.end_date),
            rental_type: rentalForm.rental_type ?? 'hours',
            limit_value: rentalForm.limit_value,
            price_per_unit: rentalForm.price_per_unit,
            fuel_start: rentalForm.fuel_start,
            odometer_start: rentalForm.odometer_start,
            created_by: rentalForm.created_by ?? null,
        };

        if (isEditMode.value && rentalId.value) {
            const response = await rentalService.update(rentalId.value, payload);
            toast.add({
                severity: "success",
                summary: "رسالة نجاح",
                detail: "تم تحديث بيانات التاجير بنجاح",
                life: 3000,
            });
        } else {
            const response = await rentalService.create(payload);
            toast.add({
                severity: "success",
                summary: "رسالة نجاح",
                detail: "تم حفظ بيانات التاجير بنجاح",
                life: 3000,
            });
        }
    } catch (err: any) {
        console.log(err)
        toast.add({
            severity: "error",
            summary: "رسالة نجاح",
            detail: "حدث خطاء ما اثناء حفظ بيانات الحجز",
            life: 3000
        });
    } finally {
        isSaving.value = false;
        addEditRentalDialogVisible.value = false;
        rentalInformationDrawerVisible.value = false;
        resetForm()
        fetchAllRentals()
    }
}

const saveNewCustomer = async()=>{
    try {
        isSaving.value = true;
        const payload = {
            fullname: newCustomerForm.fullname,
            national_id: newCustomerForm.national_id,
            birthday: newCustomerForm.birthday,
            license_number: newCustomerForm.license_number,
            vip_level: newCustomerForm.vip_level,
            email: newCustomerForm.email,
            phone1: newCustomerForm.phone1,
            phone2: newCustomerForm.phone2,
            address: newCustomerForm.address,
        }

        const response = await customersService.create(payload);

        toast.add({
            severity: "success",
            summary: "رسالة نجاح",
            detail: "تم اضافة بيانات الزبون بنجاح",
            life: 3000
        });
        cancelAddCustomer();
        await fetchAllCustomers();
        rentalForm.customer_id = response.customer_id;
    } catch (err: any) {
        console.log(err)
        toast.add({
            severity: "error",
            summary: "رسالة خطاء",
            detail: "حصل خطاء ما اثناء اضافة بيانات الزبون",
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
}

const showCompleteRentalDialog = (rental: any)=>{
    if (!rental) return;
    rentalId.value = rental.rental_id;
    completeRentalDialogVisible.value = true;
}

const completeRental = async()=>{
    if (!rentalId.value) return;
    isSaving.value = true;
    try {
        const payload = {
            ...completeForm
        }
        const response = await rentalService.complete(rentalId.value, payload);
        toast.add({
            severity: "success",
            summary: "رسالة نجاح",
            detail: "تم انهاء الحجز بنجاح",
            life: 3000
        })
    } catch (err: any) {
        console.log(err)
        toast.add({
            severity: "error",
            summary: "رسالة خطاء",
            detail: "حدث خطاء ما اثناء حفظ بيانات استلام العجلة وانهاء التاجير",
            life: 3000
        });
    } 
}

function toLocalISO(date: any) {
    if (!date) return null;
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 19); // بدون Z
}

const selectedCustomer = computed(() => {
    if (!rentalForm.customer_id) return null;

    return allCustomers.value.find(
        c => c.customer_id === rentalForm.customer_id
    ) ?? null;
});

const selectedVehicle = computed(() => {
    if (!rentalForm.vehicle_id) return null;

    return allVehicles.value.find(
        v => v.vehicle_id === rentalForm.vehicle_id
    ) ?? null;
});

const showRentalInfo = (rentalInfo: any) => {
    if (!rentalInfo) return;

    // 1) إذا وصل ريسبونس كامل من الـAPI:
    // { status: true, data: [ { rental... } ] }
    if (rentalInfo.data && Array.isArray(rentalInfo.data)) {
        selectedRentalInformation.value = rentalInfo.data[0] ?? null;
    }
    // 2) إذا وصل [ { rental... } ]
    else if (Array.isArray(rentalInfo)) {
        selectedRentalInformation.value = rentalInfo[0] ?? null;
    }
    // 3) إذا وصل { rental... } مباشر من جدول/سطر datatable
    else {
        selectedRentalInformation.value = rentalInfo;
    }

    rentalInformationDrawerVisible.value = true;
};

const showCancelRentalDialog = (rental: any)=>{
    if (!rental) return;
    cancelRentalDialogVisible.value = true;
}

const showConfirmRental = async(rental: any)=> {
    if (isConfirming.value) return;
    if (!rental || cancelReson.value.length <= 0) return;
    console.log(rental)
    isConfirming.value = true;
    try {
        await rentalService.cancel(rental.rental_id, cancelReson.value);
        toast.add({
            severity: "success",
            summary: "تم الغاء الطلب",
            detail: "تم الغاء الحجز ينجاح",
            life: 3000
        });
        fetchAllRentals();
    } catch (err: any) {
        toast.add({
            severity: "error",
            summary: "رسالة خطاء",
            detail: "حصل خطاء ما اثناء الغاء الحجز",
            life: 3000
        });
    } finally {
        isConfirming.value = false;
        cancelReson.value = ""
    }
}

const rental = computed(() => selectedRentalInformation.value ?? null);

const timelineItems = computed(() => {
    const r = rental.value;
    if (!r) return [];

    return [
        // =============== Branch ===============
        {
            title: 'معلومات الفرع',
            subtitle: r.branch?.name ?? '',
            icon: 'fas fa-building',
            color: '#0d6efd',
            body: `
                <div class="grid">
                    <div class="col-6"><strong>الفرع:</strong> ${r.branch?.name ?? '-'}</div>
                    <div class="col-6"><strong>الهاتف:</strong> ${r.branch?.phone1 ?? '-'}</div>
                    <div class="col-12"><strong>العنوان:</strong> ${r.branch?.address ?? '-'}</div>
                </div>
            `
        },

        // =============== Customer ===============
        {
            title: 'بيانات العميل',
            subtitle: r.customer?.fullname,
            icon: 'fas fa-user',
            color: '#28a745',
            body: `
                <div class="grid">
                    <div class="col-6"><strong>الاسم:</strong> ${r.customer?.fullname ?? '-'}</div>
                    <div class="col-6"><strong>الهاتف:</strong> ${r.customer?.phone1 ?? '-'}</div>
                </div>
            `
        },

        // =============== Vehicle ===============
        {
            title: 'بيانات السيارة',
            subtitle: r.vehicle?.plate_number,
            icon: 'fas fa-car',
            color: '#ffc107',
            body: `
                <div class="grid">
                    <div class="col-4"><strong>اللوحة:</strong> ${r.vehicle?.plate_number ?? '-'}</div>
                    <div class="col-4"><strong>النوع:</strong> ${r.vehicle?.brand ?? '-'}</div>
                    <div class="col-4"><strong>الموديل:</strong> ${r.vehicle?.model ?? '-'}</div>
                </div>
            `
        },

        // =============== Rental Main Info ===============
        {
            title: 'تفاصيل العقد',
            subtitle: r.status,
            icon: 'fas fa-file-contract',
            color: '#9C27B0',
            body: `
                <div class="grid">
                    <div class="col-6"><strong>البداية:</strong> ${r.start_date}</div>
                    <div class="col-6"><strong>النهاية:</strong> ${r.end_date}</div>
                    <div class="col-6"><strong>نوع العقد:</strong> ${r.rental_type}</div>
                    <div class="col-6"><strong>السعر للوحدة:</strong> ${r.price_per_unit}</div>
                    <div class="col-6"><strong>الإجمالي:</strong> ${r.total_price}</div>
                    <div class="col-6"><strong>العداد:</strong> ${r.odometer_start} → ${r.odometer_end}</div>
                </div>
            `
        },

        // =============== Inspections ===============
        {
            title: 'عمليات الفحص',
            subtitle: r.inspections?.length ? 'تم إجراء فحص' : 'لا يوجد فحص',
            icon: 'fas fa-clipboard-check',
            color: '#3F51B5',
            body: r.inspections?.length
                ? r.inspections.map(i => `
                    <div class="border-bottom-1 surface-border pb-2 mb-2">
                        <div><strong>نوع الفحص:</strong> ${i.inspection_type}</div>
                        <div><strong>التاريخ:</strong> ${i.date}</div>
                        <div><strong>ملاحظات:</strong> ${i.notes}</div>
                    </div>
                `).join('')
                : `<p>لا يوجد فحص مسجل</p>`
        },

        // =============== Dates ===============
        {
            title: 'تاريخ الإنشاء والتعديل',
            subtitle: 'وقت النظام',
            icon: 'fas fa-calendar-alt',
            color: '#607D8B',
            body: `
                <div class="grid">
                    <div class="col-6"><strong>أنشئ في:</strong> ${r.created_at}</div>
                    <div class="col-6"><strong>آخر تحديث:</strong> ${r.updated_at}</div>
                    <div class="col-12"><strong>أنشئ بواسطة:</strong> ${r.created_by?.fullname}</div>
                </div>
            `
        },
    ];
});

onMounted(() => {
    fetchAllRentals();
})
</script>

<style scoped>
.booking-card {
  border: 1px solid var(--surface-border);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.booking-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.p-card-body) {
  padding: 1.25rem;
}

:deep(.p-card-content) {
  padding: 0;
}

:deep(.p-drawer.p-component) {
    width: 100% !important;
}

.rental-info-drawer .p-card {
    border-radius: 12px;
}

.rental-info-drawer .p-card-title {
    font-weight: bold;
    font-size: 1.2rem;
}

.customized-timeline .p-timeline-event-opposite {
    display: none !important; /* لإخفاء الجهة المقابلة */
}

.customized-timeline .p-timeline-event-content {
    padding-top: 0;
}

.rental-info-drawer .p-card {
    background: var(--surface-800) !important;     /* خلفية داكنة */
    border-radius: 12px !important;
    border: 1px solid var(--surface-600) !important; /* حدود خفيفة */
    box-shadow: 0 2px 6px rgba(0,0,0,0.45) !important;
    transition: 0.25s ease;
}

/* عنوان الكارد */
.rental-info-drawer .p-card-title {
    color: var(--primary-color-text) !important;
    font-size: 1.25rem;
    font-weight: 600;
}

/* النصوص الثانوية */
.rental-info-drawer .p-card-subtitle {
    color: var(--surface-300) !important;
    font-size: 0.85rem !important;
}

/* محتوى الكارد */
.rental-info-drawer .p-card-content {
    color: var(--text-color-secondary) !important;
}

/* عند الـHover في الوضع الداكن */
.rental-info-drawer .p-card:hover {
    border-color: var(--primary-color) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.6) !important;
    transform: translateY(-2px);
}

/* تعديل timeline في الوضع الداكن */
.customized-timeline .p-timeline-event-content {
    padding-top: 0;
}

.customized-timeline .p-timeline-event-opposite {
    display: none !important;
}

/* ================================
   Premium Dark Card — Rental Drawer
   ================================ */

.rental-info-drawer .p-card {
    background: linear-gradient(135deg, var(--surface-800), var(--surface-900)) !important;
    border-radius: 16px !important;
    border: 1px solid rgba(255,255,255,0.05) !important;
    padding-bottom: 0 !important;
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.55),
        inset 0 0 0 1px rgba(255,255,255,0.06) !important;
    transform: translateY(0px);
    transition: all .25s ease;
}

/* Hover effect */
.rental-info-drawer .p-card:hover {
    transform: translateY(-3px);
    box-shadow:
        0 6px 14px rgba(0, 0, 0, .65),
        inset 0 0 0 1px var(--primary-color) !important;
}

/* ============ Header Title ============ */
.rental-info-drawer .p-card-title {
    display: flex;
    align-items: center;
    gap: .75rem;
    color: var(--primary-color-text) !important;
    font-size: 1.3rem;
    font-weight: 700;
    padding-bottom: .25rem;
    border-bottom: 1px solid var(--surface-600);
}

/* Title icon */
.rental-info-drawer .p-card-title i {
    font-size: 1.4rem;
    color: var(--primary-color);
}

/* Subheader */
.rental-info-drawer .p-card-subtitle {
    color: var(--surface-300) !important;
    margin-top: .4rem;
    font-size: .9rem;
}

/* Content text */
.rental-info-drawer .p-card-content {
    padding-top: 1rem !important;
    color: var(--text-color-secondary) !important;
    line-height: 1.7;
}

/* Divider inside card */
.rental-info-drawer .section-divider {
    height: 1px;
    background: linear-gradient(
        to right,
        transparent,
        var(--surface-600),
        transparent
    );
    margin: .75rem 0;
}

/* Fade animation for cards */
.rental-info-drawer .p-card {
    animation: fadeSlideIn .35s ease forwards;
    opacity: 0;
}

@keyframes fadeSlideIn {
    0%   { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
}
</style>
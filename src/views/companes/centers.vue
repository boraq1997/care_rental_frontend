<template>
    <div class="card" dir="rtl">
        <div class="card flex justify-center mt-1 mb-3">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems"/>
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
                class="p-button-sm" 
                label="مركز جديد"
                icon="fas fa-plus" 
                @click="openAddEditCenterInfo()"
            />
        </div>

        <Carousel :value="allCenters" :numVisible="3" :numScoll="3" :responsiveOptions="responsiveOptions">
            <template #item="slotProps">
                <div class="m-1 p-1"> 
                    <Card class="custom-card shadow-1 hover:shadow-3 transition-all transition-duration-300 border-round-lg overflow-hidden">
                        <template #header>
                            <div class="h-0.5rem bg-primary"></div>
                        </template>

                        <template #title>
                            <div class="flex align-items-center justify-content-between px-2 pt-2">
                                <div class="flex align-items-center gap-2">
                                    <Avatar 
                                        v-if="slotProps.data.logo_path" 
                                        :image="slotProps.data.logo_path" 
                                        size="normal" 
                                        shape="circle" 
                                    />
                                    <Avatar 
                                        v-else 
                                        :label="slotProps.data.name?.charAt(0).toUpperCase()" 
                                        size="normal" 
                                        shape="circle" 
                                        class="bg-primary text-white text-xs"
                                    />
                                    <h5 class="m-0 text-800 line-height-1 text-sm md:text-base">{{ slotProps.data.name }}</h5>
                                </div>

                                <div class="flex align-items-center gap-1">
                                    <Button icon="pi pi-pencil" class="p-button-text p-button-rounded p-button-sm w-2rem h-2rem" @click="openAddEditCenterInfo(slotProps.data)" />
                                    <Button icon="fas fa-trash-alt" class="p-button-text p-button-rounded p-button-sm w-2rem h-2rem" severity="danger" @click="confirmDeleteCenter(slotProps.data)" />
                                    <Tag :severity="slotProps.data.is_active ? 'success' : 'info'" :value="slotProps.data.is_active ? 'نشط' : 'إنتظار'" class="text-xs px-2 py-1" rounded></Tag>
                                </div>
                            </div>
                        </template>

                        <template #content>
                            <div class="px-2">
                                <p class="m-0 text-500 text-xs line-height-2 min-h-2rem overflow-hidden text-overflow-ellipsis">
                                    {{ slotProps.data.description || 'لا يوجد وصف متاح.' }}
                                </p>
                                
                                <div class="flex align-items-center justify-content-between mt-2 p-2 border-round bg-primary-reverse shadow-1">
                                    <div class="flex align-items-center gap-2">
                                        <div class="w-2rem h-2rem flex align-items-center justify-content-center bg-primary border-round-circle">
                                            <i class="pi pi-sitemap text-white text-sm"></i>
                                        </div>
                                        <div class="flex flex-column">
                                            <span class="text-xs text-500 font-medium">الفروع</span>
                                            <span class="text-lg font-bold text-primary">{{ slotProps.data.branches?.length || 0 }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-content-end mt-3">
                                    <Button
                                        icon="fas fa-eye"
                                        label="عرض"
                                        class="p-button-rounded p-button-outlined"
                                        @click="showFullCenterDetails(slotProps.data)"
                                    />
                                </div>
                            </div>
                        </template>

                        <template #footer>
                            <div class="flex justify-content-between align-items-center px-2 py-2 border-top-1 border-100 surface-50 -m-3 mt-2">
                                <div class="flex align-items-center text-700">
                                    <i class="pi pi-user ml-1 text-xs"></i>
                                    <span class="text-xs truncate w-5rem font-medium">{{ slotProps.data.manager?.fullname?.split(' ')[0] || 'المدير' }}</span>
                                </div>
                                <div class="flex align-items-center text-400 text-xs scale-90">
                                    <i class="pi pi-calendar ml-1"></i>
                                    {{ new Date(slotProps.data.created_at).toLocaleDateString('ar-SA') }}
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
            </template>
        </Carousel>

        <div v-if="showCenterDetails" class="showCenterDetails">
            <div class="branches p-4">
                <DataTable
                    :value="centerFullInfo.branches"
                    dataKey="branch_id"
                    :rows="10"
                    responsiveLayout="scroll"
                    class="text-right"
                >
                    <template #header>
                        <div class="flex justify-between items-center">
                            <h3>المراكز</h3>
                        </div>
                    </template>

                    <template #empty>
                        <Message severity="warn">لم يتم العثور على فروع</Message>
                    </template>
                    <template #loading> جاري تحميل بيانات الفروع... </template>

                    <Column field="name">
                        <template #header>
                            <i class="fas fa-code-branch text-gray-500"/>
                            اسم الفرع
                        </template>
                    </Column>

                    <Column field="manager.fullname">
                        <template #header>
                            <i class="fas fa-user-tie text-gray-500"/>
                            مدير الفرع
                        </template>
                    </Column>

                    <Column field="phone1">
                        <template #header>
                            <i class="fas fa-phone-flip text-gray-500"/>
                            رقم الهاتف 1
                        </template>
                    </Column>

                    <Column field="phone2">
                        <template #header>
                            <i class="fas fa-phone-flip text-gray-500"/>
                            رقم الهاتف 2
                        </template>
                    </Column>

                    <Column field="address">
                        <template #header>
                            <i class="fas fa-location-arrow text-gray-500"/>
                            العنوان
                        </template>
                    </Column>

                    <Column field="google_map_location">
                        <template #header>
                            <i class="fas fa-map-location-dot text-gray-500"/>
                            العنوان
                        </template>
                        <template #body>
                            <Button
                                severity="secondary"
                                label="عرض على الخريطة"
                                icon="fas fa-hand-pointer"
                                />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <Dialog
            v-model:visible="addEditCenterDiloagVisible"
            :header="isEditngMode ? 'تعديل بيانات المركز' : 'اضافة مركز جديد'"
            :style="{width: '40vw'}"
            modal
            @hide="resetForm"
            dir="rtl"
        >
            <div class="flex flex-column gap-4 mt-2">
                <div>
                    <FloatLabel variant="on">
                        <InputText id="center_name" v-model="centerForm.name" fluid/>
                        <label for="center_name"><i class="fas fa-building"/> اسم المركز</label>
                    </FloatLabel>
                </div>

                <div>
                    <FloatLabel variant="on">
                        <Textarea id="center_description" :rows="3" v-model="centerForm.description" fluid/>
                        <label for="center_description"><i class="fas fa-text-width"/> تفاصيل المركز</label>
                    </FloatLabel>
                </div>

                <div class="grid">
                    <div class="col">
                        <div>
                            <FloatLabel variant="on">
                                <InputText id="center_phone" v-model="centerForm.contact_info.phone" fluid/>
                                <label for="center_phone"><i class="fas fa-phone-flip"/> رقم الهاتف</label>
                            </FloatLabel>
                        </div>
                    </div>

                    <div class="col">
                        <div>
                            <FloatLabel variant="on">
                                <InputText id="center_email" v-model="centerForm.contact_info.email" fluid/>
                                <label for="center_email"><i class="fas fa-envelope"/> البريد الالكتروني</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
                <div>
                    <FloatLabel variant="on">
                        <InputText id="center_address" v-model="centerForm.contact_info.address" fluid/>
                        <label for="center_address"><i class="fas fa-map-location-dot"/> العنوان</label>
                    </FloatLabel>
                </div>

                <div class="grid">
                    <div class="col">
                        <div>
                            <FileUpload ref="centerLogo" mode="basic" name="demo[]" accept="image/*" :maxFileSize="1000000"/>
                            <Button label="Upload" severity="secondary" />
                        </div>
                    </div>
                    <div class="col">
                        <div>
                            <FloatLabel variant="on">
                                <Select id="center_active" v-model="centerForm.is_active" fluid :options="[{label: 'مفعل', value: true}, {label: 'معطل', value: false}]" optionLabel="label" optionValue="value"/>
                                <label for="center_active"><i class="fas fa-info-circle"/> الحالة</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button
                    @click="resetForm"
                    label="الغاء"
                    icon="fas fa-times"
                    severity="secondary"
                    class="p-button-sm"
                />

                <Button
                    :label="isEditngMode ? 'حفظ' : 'إضافة'"
                    icon="fas fa-floppy-disk"
                    :loading="isLoading"
                    class="p-button-sm"
                    @click="saveCenterInfo"
                />
            </template>
        </Dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import Breadcrumb from "primevue/breadcrumb";
import Button from "primevue/button";
import centerService, {type CenterForm} from "./centersService";
import { FilterMatchMode } from "@primevue/core/api";
import Message from 'primevue/message';
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import FloatLabel from 'primevue/floatlabel';
import Dialog from "primevue/dialog";
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import FileUpload from 'primevue/fileupload';
import Carousel from 'primevue/carousel';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Tag from "primevue/tag";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const toast = useToast();
const confirm = useConfirm();

const allCenters = ref<any[]>([]);
const centerFullInfo = ref([]);
const currentCenterId = ref();
// page confirmations
const isEditngMode = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);
const isConfirming = ref(false)

const addEditCenterDiloagVisible = ref(false);
const showCenterDetails = ref(false)

const filters = reactive({
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
})

const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);

const getSeverity = (status) => {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};

const showAllUsersInCenterDialogVisible = ref(false);
const showAllVehiclesInCenterDialogVisible = ref(false);
const showAllRentalsInCenterDialogVisible = ref(false);
const showAllBranchesInCenterDialogVisible = ref(false);

const breadcrumbHome = ref({icon: 'fas fa-home', to: '/'});
const breadcrumbItems = ref([
    {label: "الرئيسية", icon: "fas fa-house", to: "/"},
    {label: "المراكز", icon: "fas fa-building", to: '/centerInfo'},
]);

const centerForm = ref<CenterForm>({
  name: "",
  description: "",
  contact_info: {
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
  },
  website_url: "",
  logo_path: null,
  is_active: true,
});

const fetchAllCenters = async()=>{
    try {
        const response = await centerService.getAll();
        allCenters.value = response;
    } catch (err: any) {
        console.log(err);
        toast.add({
            severity: "error",
            summary: "رسالة خطاء",
            detail: "حدث خطاء ما اثناء جلب بيانات المراكز",
            life: 3000,
        });
    } 
}

const openAddEditCenterInfo = (center: any = null) => {
  if (center) {
    isEditngMode.value = true;
    currentCenterId.value = center.center_id;

    centerForm.value = {
      name: center.name ?? "",
      description: center.description ?? "",
      contact_info: {
        phone: center.contact_info?.phone ?? "",
        email: center.contact_info?.email ?? "",
        address: center.contact_info?.address ?? "",
        whatsapp: center.contact_info?.whatsapp ?? "",
      },
      website_url: center.website_url ?? "",
      logo_path: center.logo_path ?? null,
      is_active: center.is_active ?? true,
    };
  } else {
    resetForm();
  }

  addEditCenterDiloagVisible.value = true;
};

const saveCenterInfo = async()=>{
    isSaving.value = true;
    try {
        if(isEditngMode.value) {
            await centerService.update(currentCenterId.value, centerForm.value);
            toast.add({
                severity:"success",
                summary: "رسالة نجاح",
                detail: "تم تحديث بيانات المركز بنجاح",
                life: 3000,
            });
        } else {
            await centerService.create(centerForm.value);
            toast.add({
                severity: "success",
                summary: "رسالة نجاح",
                detail: "تم اضافة بيانات المركز بنجاح",
                life: 3000,
            });
        }
        resetForm();
        fetchAllCenters();
    } catch (err: any) {
        console.log(err);
        toast.add({
            severity: "error",
            summary: "رسالة خطاء",
            detail: "حدث خطاء ما اثناء حفظ بيانات المركز",
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
}

const confirmDeleteCenter = (center: any)=> {
    if (isConfirming.value) return;
    isConfirming.value = true;

    confirm.require({
        header: "تأكيد الحذف",
        message: ` هل انت متاكد من حذف بيانات المركز ${center.name}`,
        icon: "pi pi-exclamation-triangle text-yellow-500",
        acceptLabel: "تأكيد",
        acceptIcon: "pi pi-check",
        acceptClass:"p-button-sm border border-red-500 bg-red-500 text-white",
        rejectLabel: "إلغاء",
        rejectIcon: "pi pi-times",
        rejectClass:"p-button-sm border border-gray-400 text-gray-600 bg-transparent hover:bg-gray-200",
        accept: async()=>{
            try {
                await centerService.delete(center.center_id);
                toast.add({
                    severity: "success",
                    summary: "رسالة نجاح",
                    detail: "تم حذف بيانات المركز بنجاح",
                    life: 3000,
                });
                fetchAllCenters();
            } catch (err: any) {
                console.log(err)
                toast.add({
                    severity: "error",
                    summary: "رسالة خطاء",
                    detail: "عذرا حدث خطاء ما اثناء حذف بيانات المركز",
                    life: 3000
                });
            } finally {
                isConfirming.value = false;
            }
        },
        reject: ()=>(isConfirming.value = false)
    })
}

const showFullCenterDetails = (center: any) => {
    if (!center) return;
    showCenterDetails.value = true;
    centerFullInfo.value = center;
} 

const resetForm = () => {
  isEditngMode.value = false;
  currentCenterId.value = null;
  addEditCenterDiloagVisible.value = false;

  centerForm.value = {
    name: "",
    description: "",
    contact_info: {
      phone: "",
      email: "",
      address: "",
      whatsapp: "",
    },
    website_url: "",
    logo_path: null,
    is_active: true,
  };
};

onMounted(()=>{
    fetchAllCenters();
})
</script>
<style scoped>
.custom-card {
  border: 1px solid var(--surface-border);
  background: var(--surface-card);
}

.bg-primary-reverse {
  /* تأثير خلفية خفيفة جداً من لون الثيم الأساسي */
  background-color: var(--primary-50);
}

.hover\:shadow-5:hover {
  transform: translateY(-5px);
  border-color: var(--primary-color);
}
</style>
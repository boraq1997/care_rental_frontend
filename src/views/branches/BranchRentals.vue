<template>
    <DataTable
        v-model:filters="rentalsFilters"
        :value="allRentals"
        dataKey="rental_id"
        paginator
        :rows="10"
        filterDisplay="menu"
        :globalFilterFields="[]"
        responsiveLayout="scroll"
        dir="rtl"
        >
        <template #header>
            <div class="flex justify-between">
                <IconField>
                    <InputIcon class="fas fa-search" />
                    <InputText 
                        v-model="rentalsFilters.global.value" 
                        placeholder="بحث..." 
                    />
                </IconField>
            </div>
        </template>
        <template #empty>
            <Message severity="warn">لا توجد عمليات تاجير لهذا المركز</Message>
        </template>

        <Column field="start_date" header="بداية التاجير" sortable>
            <template #header>
                <i class="fas fa-calendar"/>
            </template>
            <template #body="{data}">
                <Tag
                    icon="fas fa-clock"
                    severity="secondary"
                    :value="data.start_date"
                    />
            </template>
        </Column>

        <Column field="end_date" header="انتهاء التاجير" sortable>
            <template #header>
                <i class="fas fa-calendar"/>
            </template>
            <template #body="{data}">
                <Tag
                    icon="fas fa-clock"
                    severity="danger"
                    :value="data.end_date"
                    />
            </template>
        </Column>

        <Column field="vehicle.brand" header="تفاصيل العجلة" sortable>
            <template #header>
                <i class="fas fa-car"/>
            </template>
            <template #body="{data}">
                <Button icon="fas fa-car" label="تفاصيل العجلة" severity="danger" class="p-button-sm" iconPos="right" @click="openCarDialog(data.vehicle)"/>
            </template>
        </Column>

        <Column field="price_per_unit" header="سعر التاجير" sortable>
            <template #header>
                <i class="fas fa-sort-amount-asc"/>
            </template>
        </Column>

        <Column field="total_price" header="المبلغ الكلي" sortable>
            <template #header>
                <i class="fas fa-sort-amount-asc"/>
            </template>
        </Column>

        <Column field="rental_type" header="نوع التاجير" sortable>
            <i class="fas fa-home"/>
        </Column>

        <Column field="status" header="الحالة" sortable>
            <template #header>
                <i class="fas fa-home"/>
            </template>
            <template #body="{data}">
                <Tag v-if="data.status === 'active'" icon="fas fa-hourglass-half" severity="success" value="نشط"></Tag>
                <Tag v-if="data.status === 'completed'" icon="fas fa-check-double" severity="info" value="منتهيه"></Tag>
                <Tag v-if="data.status === 'canceled'" icon="fas fa-circle-xmark" severity="danger" value="ملغاة"></Tag>
            </template>
        </Column>

        <Column field="created_by.fullname" header="الموظف" sortable>
            <template #header>
                <i class="fas fa-user-tag"/>
            </template>
            <template #body="{data}">
                <Button icon="fas fa-user-tag" severity="info" label="معلومات الموضف"  class="p-button-sm" @click="openUserCreateDialog(data.created_by)"/>
            </template>
        </Column>

        <Column field="customer.fullname" header="معلومات الزبون" sortable>
            <template #header>
                <i class="fas fa-user-tie"/>
            </template>
            <template #body="{data}">
                <Button icon="fas fa-user-tie" label="معلومات الزبون" class="p-button-sm" @click="openCustomerDialog(data.customer)"/>
            </template>
        </Column>
    </DataTable>

    <Dialog
        v-model:visible="carDialogVisible"
        header="معلومات العجلة"
        modal
        :style="{width: '30vw'}"
        dir="rtl"
        >
        <Card style="width: 100%" overflow="hidden">
            <template #header>
                <Galleria 
                    style="height: 30%;"
                    :value="images" 
                    :responsiveOptions="responsiveOptions"
                    :numVisible="5"
                    :circular="true"
                    :showItemNavigators="true"
                    :showThumbnails="false"
                    containerStyle="max-width: 640px"
                    >
                    <template #item="slotProps">
                        <Image 
                            :key="slotProps.item.itemImageSrc"
                            :src="slotProps.item.itemImageSrc"
                            preview
                            alt="slotProps.item.alt"
                            class="galleria-image"
                        />
                    </template>
                    <template #thumbnail="slotProps">
                        <img 
                            :src="slotProps.item.thumbnailImageSrc" 
                            :alt="slotProps.item.alt"
                            style="display: block;"/>
                    </template>
                </Galleria>
            </template>
            <template #title>
                <h2>تفاصيل العجلة</h2>
                <div class="grid">
                    <div class="col-12 md:col-6">
                        <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                            <span class="font-medium"><i class="fas fa-shop"/>الشركة</span>
                            <Tag class="ml-1 mb-2" icon="fas fa-shop" severity="secondary" :value="vehicleDialogInformations.brand"></Tag>
                        </div>
                    </div>

                    <div class="col-12 md:col-6">
                        <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                            <span class="font-medium"><i class="fas fa-code-branch"/>النوع</span>
                            <Tag class="ml-1 mb-2" icon="fas fa-code-branch" severity="warn" :value="vehicleDialogInformations.model"></Tag>

                        </div>
                    </div>

                    <div class="col-12 md:col-6">
                        <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                            <span class="font-medium"><i class="fas fa-pager"/>الرقم</span>
                            <Tag class="ml-1 mb-2" icon="fas fa-pager" severity="info" :value="vehicleDialogInformations.plate_number"></Tag>

                        </div>
                    </div>

                    <div class="col-12 md:col-6">
                        <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                            <span class="font-medium"><i class="fas fa-brush"/>اللون</span>
                            <Tag class="ml-1 mb-2" icon="fas fa-brush" severity="danger" :value="vehicleDialogInformations.color"></Tag>

                        </div>
                    </div>

                    <div class="col-12 md:col-6">
                        <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                            <span class="font-medium"><i class="fas fa-calendar"/>سنة الصنع</span>
                            <Tag class="ml-1 mb-2" icon="fas fa-calendar" severity="info" :value="vehicleDialogInformations.year"></Tag>

                        </div>
                    </div>

                </div>

                <div class="mt-2 mb-1">
                    <h3>مالك العجلة: {{ vehicleDialogInformations.owner }}</h3>
                </div>

                <div class="grid">

                    <div class="col-12 md:col-6">
                        <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                            <span class="font-medium"><i class="fas fa-quote-left"/>نوع المالك</span>
                            <Tag
                                :value="ownerLabel(vehicleDialogInformations.owner_type)"
                                :severity="ownerSeverity(vehicleDialogInformations.owner_type)"
                                icon="fas fa-quote-left"
                                class="px-3 py-1"
                            />
                        </div>
                    </div>

                    <div class="col-12 md:col-6">
                        <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                            <span class="font-medium"><i class="fas fa-user-tie"/>اسم المالك</span>
                            <Tag :value="vehicleDialogInformations.owner ? vehicleDialogInformations.owner : 'لا يوجد'" severity="success" icon="fas fa-user"/>
                        </div>
                    </div>

                </div>
                
            </template>
        </Card>  
    </Dialog>

    <Dialog
        v-model:visible="userCreateContractDialogVisible"
        header="معلومات الموظف"
        modal
        :style="{width: '60vw'}"
        dir="rtl"
    >
        <div class="flex flex-column mt-3">

            <!-- صورة + اسم -->
            <div>
                <Image
                    :src="userRentalCreatedBy.photo ?? '/p1.jpg'"
                    alt="صورة الموظف"
                    preview
                    class="rounded-lg shadow-1 surface-border w-full"
                    style="height: 500px; object-fit: cover;"
                />

                <h2>
                    {{ userRentalCreatedBy.fullname || '—' }}
                </h2>
            </div>

            <!-- البطاقة -->
            <Card style="width: 100%;">
                <template #content>

                    <div class="p-3">

                        <!-- Grid container -->
                        <div class="grid">

                            <!-- اسم المستخدم -->
                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-user-tag"/>اسم المستخدم</span>
                                    <span class="text-900">{{ userRentalCreatedBy.login.username }}</span>
                                </div>
                            </div>

                            <!-- نوع المستخدم -->
                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-users-viewfinder"/>نوع المستخدم</span>
                                    <Tag
                                        :value="roleLabel(userRentalCreatedBy.role)"
                                        :severity="roleSeverity(userRentalCreatedBy.role)"
                                        icon="fas fa-user-shield"
                                        class="px-3 py-1"
                                    />
                                </div>
                            </div>

                            <!-- حالة المستخدم -->
                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-semibold">حالة المستخدم</span>
                                    <Tag 
                                        :value="getStatusInfo(userRentalCreatedBy.status).label"
                                        :severity="getStatusInfo(userRentalCreatedBy.status).severity"
                                    />
                                </div>
                            </div>

                            <!-- البريد الإلكتروني -->
                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium "><i class="fas fa-envelope"/>البريد الإلكتروني</span>
                                    <span class="text-900">{{ userRentalCreatedBy.contact.email || 'لا يوجد'}}</span>
                                </div>
                            </div>

                            <!-- الهاتف الأول -->
                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-phone-flip"/> رقم الهاتف الأول</span>
                                    <span class="text-900">{{ userRentalCreatedBy.contact.phone1 || 'لا يوجد'}}</span>
                                </div>
                            </div>

                            <!-- الهاتف الثاني -->
                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-phone-flip"/> رقم الهاتف الثاني</span>
                                    <span class="text-900">{{ userRentalCreatedBy.contact.phone2 || 'لا يوجد'}}</span>
                                </div>
                            </div>

                            <!-- العنوان -->
                            <div class="col-12">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-location-dot"/> العنوان</span>
                                    <span class="text-900">{{ userRentalCreatedBy.contact.address || 'لا يوجد'}}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </template>
            </Card>

        </div>
    </Dialog>

    <Dialog
        v-model:visible="customerDialogVisible"
        header="معلومات الزبون"
        modal
        :style="{width: '75vw'}"
        dir="rtl"
        >
        <div class="flex flex-column">
            <h2>
                {{ customerInformation.fullname }}
            </h2>

            <Card style="width: 100%">
                <template #content>
                    <div class="p-3">
                        <div class="grid">

                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-address-card"/>رقم الهوية الشخصية</span>
                                    <span class="text-900">{{ customerInformation.national_id }}</span>
                                </div>
                            </div>

                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-id-card-clip"/>رقم الاجازة</span>
                                    <span class="text-900">{{ customerInformation.license_number }}</span>
                                </div>
                            </div>

                           <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium">
                                        <i class="fas fa-users-viewfinder"></i> نوع العضوية
                                    </span>

                                    <Tag 
                                        icon="fas fa-medal"
                                        :value="vipLabel(customerInformation.vip_level)"
                                        :severity="vipSeverity(customerInformation.vip_level)"
                                    />
                                </div>
                            </div>

                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-calendar-days"/>تأريخ الميلاد</span>
                                    <span class="text-900">{{ customerInformation.birthday }}</span>
                                </div>
                            </div>
                        </div>

                            <div class="mt-2 mb-1">
                                <h3>معلومات الاتصال</h3>
                            </div>
                        <div class="grid">
                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-map-location-dot"/>العنوان</span>
                                    <span class="text-900">{{ customerInformation.contact.address }}</span>
                                </div>
                            </div>

                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-phone-flip"/>رقم الهاتف 1</span>
                                    <span class="text-900">{{ customerInformation.contact.phone1 }}</span>
                                </div>
                            </div>

                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-phone-flip"/>رقم الهاتف 2</span>
                                    <span class="text-900">{{ customerInformation.contact.phone2 }}</span>
                                </div>
                            </div>

                            <div class="col-12 md:col-6">
                                <div class="flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <span class="font-medium"><i class="fas fa-envelope"/>البريد الالكتروني</span>
                                    <span class="text-900">{{ customerInformation.contact.email }}</span>
                                </div>
                            </div>


                        </div>
                    </div>
                </template>
            </Card>
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
    import rentalService from "../rentals/rentalService";
    import { useToast } from "primevue/usetoast";
    import { useConfirm } from "primevue/useconfirm";
    import vehicleService from "../vehicles/vehicelsService";
    import Card from 'primevue/card';
    import Galleria from 'primevue/galleria';
    import Image from 'primevue/image';
    import UsersService from "../users/usersService";
    import customersService from "../customers/customersService";
    import Chip from 'primevue/chip';

    /* =====================================
    STATE VARIABLES
    ===================================== */
    const toast = useToast();                 // Toast notification instance
    const confirm = useConfirm();             // Confirmation dialog instance

    const allRentals = ref<any[]>([])
    const carDialogVisible = ref(false);
    const userCreateContractDialogVisible = ref(false);
    const userRentalCreatedBy = ref([]);
    const customerDialogVisible = ref(false);
    const customerInformation = ref([]);

    const vehicleDialogInformations = ref<any[]>([]);
    const images = ref([]);
    const responsiveOptions = ref([]);
    
    const rentalsFilters = reactive({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS}
    });

    const roleLabel = (role: string) => {
        switch (role) {
            case "super_admin":
            return "المدير العام";
            case "branch_admin":
            return "مدير الفرع";
            case "employee":
            return "موظف";
            case "owner":
            return "صاحب المركبة";
            default:
            return role;
        }
    };

    const roleSeverity = (role: string) => {
        switch (role) {
            case "super_admin":
            return "danger";      // أحمر
            case "branch_admin":
            return "warning";     // أصفر
            case "employee":
            return "info";        // أزرق
            case "owner":
            return "success";     // أخضر
            default:
            return "secondary";   // رمادي
        }
    };

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

    const ownerLabel = (type: string) => {
        switch (type) {
            case "branche":
                return "مملوكة للفرع";
            case "otherOwner":
                return "مملوكة لمالك آخر";
            default:
                return type;
        }
        };

    const ownerSeverity = (type: string) => {
        switch (type) {
            case "branch":
            return "primary";   // أزرق، مناسب لملكية النظام
            case "otherOwner":
            return "secondary"; // رمادي، مناسب لطرف خارجي
            default:
            return "info";
        }
    };

    watch(
        () => props.branchId,
        async(newId) => {
            if (!newId) return;
            await fetchAllRentals(newId);
        },
        {immediate: true}
    );

    async function fetchAllRentals(branchId: number) {
        try {
            const response = await rentalService.getByBranch(branchId);
            allRentals.value = response
        } catch (err) {
            console.log(err)
            toast.add({
                severity: 'error',
                summary: 'رسالة خطاء',
                detail: 'حدث خطاء اثناء جلب بيانات الحجوزات',
                life: 3000
            });
        }
    }

    const openCarDialog = async(carInfo: any[]) => {
        carDialogVisible.value = true;

        try {
            const response = await vehicleService.getById(carInfo.vehicle_id);
            vehicleDialogInformations.value = response.data;
        } catch (err: any) {
            toast.add({
            severity: 'error',
            summary: 'رسالة خطاء',
            detail: 'حدث خطاء ما اثناء جلب بيانات العجلة',
            life: 3000,
            });
        } finally {
            responsiveOptions.value = [
                {breakpoint: '991px',numVisible: 4},
                {breakpoint: '767px',numVisible: 3},
                {breakpoint: '575px',numVisible: 1}
            ];

            // هنا تضيف الصور الموجودة في public
            images.value = [
            { itemImageSrc: '/1.jpg', thumbnailImageSrc: '/1.jpg', alt: 'صورة 1' },
            { itemImageSrc: '/2.jpg', thumbnailImageSrc: '/2.jpg', alt: 'صورة 2' },
            { itemImageSrc: '/3.jpg', thumbnailImageSrc: '/3.jpg', alt: 'صورة 3' }
            ];
        }
        };

    const openUserCreateDialog = async(userCreateInfo: any)=>{
        if (!userCreateInfo) {
            toast.add({
                severity: "error",
                summary: "رسالة خطاء",
                detail: "حدث خطاء ما اثناء عرض تفاصيل المستخدم",
                life: 3000,
            });
            return;
        }
        try {
            const response = await UsersService.getById(userCreateInfo.user_id);
            userRentalCreatedBy.value = response;
            userCreateContractDialogVisible.value = true;
        } catch (err: any) {
            console.log(err);
            toast.add({
                severity: "error",
                summary: "رسالة خطاء",
                detail: "حدث خطاء ما اثناء عرض تفاصيل المستخدم",
                life: 3000
            });
        } finally {
            
        }
    }

    const openCustomerDialog = async(customer: any[])=>{
        if (!customer) {
            toast.add({
                severity: 'error',
                summary: 'رسالة خطاء',
                detail: 'حدث خطاء ما اثناء جلب بيانات الزبون',
                life: 3000,
            });
            return;
        }

        try {
            const response = await customersService.getById(customer.customer_id)
            customerInformation.value = response;
            customerDialogVisible.value = true;
        } catch (err: any) {
            console.log(err)
            toast.add({
                severity: "error",
                summary: "رسالة خطاء",
                detail: "حدث خطاء اثناء جلب بيانات الزبون",
                life: 3000
            });
        }
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    }

    const statusMap = {
        active: { label: "مفعل", severity: "success" },
        inactive: { label: "معطل", severity: "danger" },
    };

    const getStatusInfo = (status) => {
        return statusMap[status] || { label: "غير معروف", severity: "secondary" };
    };
</script>
<style scoped>
:deep(.p-image img) {
    max-height: 500px !important;
    width: auto !important;
    object-fit: contain !important;
    display: block;
    margin: 0 auto;
}
</style>
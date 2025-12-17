<template>
  <!-- Main header section with navigation bar -->
  <header class="shadow-md" dir="rtl">
    <!-- PrimeVue Menubar for top navigation -->
    <Menubar 
      v-if="!isLoginPage"
      :model="topItems" 
      class="!rounded-none" 
      style="padding: 5px 50px;">
      <!-- Start slot: Application branding/logo -->
      <template #start>
        <span class="ml-2 font-bold">
          تأجير سيارات
        </span>
      </template>

      <!-- Item slot: Custom rendering for menu items -->
      <template #item="{ item, props }">
        <a
          v-ripple
          v-bind="props.action"
          class="flex align-items-center p-menuitem-link"
          :class="{
            'p-button-danger p-button-text': item.isDanger && !item.disabled,
            'p-disabled': item.disabled,
          }"
        >
          <span :class="[item.icon, 'p-menuitem-icon']" />
          <span class="p-menuitem-text">{{ item.label }}</span>
          <!-- Display badge for items with a count (e.g., deleted users) -->
          <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          <!-- Indicator for submenus -->
          <span v-if="item.hasSubmenu" class="pi pi-angle-down ml-auto" />
        </a>
      </template>

      <!-- End slot: Search input and user avatar with dropdown menu -->
      <template #end>
        <div class="flex items-center gap-2">
          <!-- User avatar with clickable menu -->
          <Avatar
            icon="pi pi-user"
            style="background-color: #dee9fc; color: #1a2551"
            shape="circle"
            @click="toggleUserMenu"
            aria-haspopup="true"
            aria-controls="overlay_menu"
          />
          <!-- User options popup menu -->
          <Menu ref="menu" id="overlay_menu" :model="userOptions" :popup="true" />
        </div>
      </template>
    </Menubar>
  </header>

  <!-- Settings drawer for application settings -->
  <Drawer
    v-model:visible="isSettingsDrawerVisible"
    header="الإعدادات"
    position="left"
    style="width: 30%;"
  >
    <p>هنا يمكنك وضع مكونات الإعدادات الخاصة بالتطبيق.</p>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Menubar from 'primevue/menubar';
import Menu from 'primevue/menu';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Drawer from 'primevue/drawer';
import { useRoute } from 'vue-router';

// call services
import AuthServices from '../auth/authService';

// === State & Services ===
// Reference to the user menu component
const menu = ref();
// Vue Router instance for navigation
const router = useRouter();

const route = useRoute();
// Count of archived (deleted) users
const deleteUsers = ref(0);

const isSettingsDrawerVisible = ref(false);
// Interval ID for polling archived users count
// let pollingInterval: number;

const isLoginPage = computed(() => {
  return route.path === '/' || route.path === '/login';
});

// === Functions ===

/**
 * @description Fetches the count of archived users and updates the state
 * @returns Promise resolving to the count of archived users
 */
// const getDeleteUsersCount = async () => {
//   try {
//     const response = await UsersServices.getArchivedUsers();
//     deleteUsers.value = response.data.data.data.length || 0;
//   } catch (err) {
//     console.error('Failed to fetch archived users count:', err);
//   }
// };


/**
 * @description Toggles the user profile dropdown menu
 * @param event - The click event triggering the menu toggle
 */
const toggleUserMenu = (event: Event) => {
  menu.value.toggle(event);
};

/**
 * @description Logs the user out and redirects to the login page
 */
const handleLogout = () => {
  AuthServices.logout();
  router.push('/'); // Redirect to login page after logout
};

// === Computed Properties for Menus ===

// Top navigation menu items
const topItems = computed(() => [
  {
    label: 'الرئيسية',
    icon: 'fas fa-home',
    command: () => router.push('/home'),
  },
  {
    label: 'المستخدمين',
    icon: 'fas fa-users',
    hasSubmenu: true, // Indicate submenu presence
    items: [
        {
            label: "عرض الكل",
            icon: "fas fa-users",
            command: ()=>router.push('/users'),
        },
        {
            label: `المحذوفات (${deleteUsers.value})`,
            icon: 'fas fa-trash-can',
            isDanger: true,
            disabled: deleteUsers.value === 0,
            // command: () => {
            //   if (deleteUsers.value > 0) {
            //       router.push('/users/deleted');
            //   }
            // },
        },
    ],
  },
  {
    label: 'الفروع',
    icon: 'fa-solid fa-code-branch',
    command: ()=>router.push('/branches')
  },
  {
    label: 'العجلات',
    icon: 'fas fa-car',
    command: ()=>router.push('/vehicles'),
  },
  {
    label: 'عمليات التاجير',
    icon: 'fas fa-receipt',
    command: ()=>router.push('/rentals'),
  },
  {
    label: 'الزبائن',
    icon: 'fas fa-user-tie',
    command: ()=>router.push('/customers'),
  }
  
]);

// User profile dropdown menu items
const userOptions = computed(() => [
  { label: 'الملف الشخصي', icon: 'pi pi-user' },
  { label: 'كلمة المرور', icon: 'pi pi-lock-open' },
  {
    label: 'الإعدادات',
    icon: 'pi pi-cog',
    command: () => {
      isSettingsDrawerVisible.value = true;
    },
  },
  { separator: true },
  {
    label: 'تسجيل الخروج',
    icon: 'pi pi-sign-out',
    command: handleLogout,
  },
]);

// === Lifecycle Hooks ===

// On component mount: Fetch initial data and start polling
onMounted(() => {
  // Poll for archived users count every 30 seconds
//   pollingInterval = window.setInterval(getDeleteUsersCount, 30000);
});

// On component unmount: Clear polling interval to prevent memory leaks
onUnmounted(() => {
//   clearInterval(pollingInterval);
});
</script>

<style scoped>
/* Scoped styles for the Navbar component */
</style>
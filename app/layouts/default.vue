<script setup>
const open = ref(false);

const { checkSession, logout, user, loggedIn } = useAuth();

const menus = [
  { name: "Dashboard", path: "/", icon: "📊", roles: ["admin", "agent"] },
  { name: "Users", path: "/users", icon: "👤", roles: ["admin", "agent"] },
  {
    name: "Withdraw Orders",
    path: "/withdraw-orders",
    icon: "💰",
    roles: ["admin"],
  },
  {
    name: "Transaction",
    path: "/transactions",
    icon: "🎲",
    roles: ["admin", "agent"],
  },
  { name: "Online Users", path: "/online-users", icon: "💰", roles: ["admin"] },
  {
    name: "Unsettled bets",
    path: "/bets/unsettled-bets",
    icon: "🎟",
    roles: ["admin"],
  },
  { name: "Account", path: "/account", icon: "🎁", roles: ["admin"] },
];

const filteredMenus = computed(() => {
  const userRole = user.value?.role; // This would be 'admin' or 'agent'
  return menus.filter((m) => {
    // If the menu item has no roles defined, show it to everyone
    if (!m.roles) return true;

    // Check if the user's role is in the allowed list
    return m.roles.includes(userRole);
  });
});

setTimeout(() => {
  console.log(filteredMenus.value, menus);
}, 2000);

onMounted(async () => {
  await checkSession();
});
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed z-30 top-0 left-0 h-full w-80 bg-[#3a184a] text-white transform transition-transform duration-300',
        open ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:static',
      ]"
    >
      <div class="p-4 text-lg font-bold border-b border-purple-700">
        Zemen Bet
      </div>

      <nav class="p-2 space-y-1">
        <NuxtLink
          v-for="m in filteredMenus"
          :key="m.name"
          :to="m.path"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
        >
          <span>{{ m.icon }}</span>
          <span>{{ m.name }}</span>
        </NuxtLink>

        <div
          @click="logout"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-purple-700 transition mt-10"
        >
          <span>⬅️</span>
          <span>Logout</span>
        </div>
      </nav>
    </aside>

    <!-- Overlay mobile -->
    <div
      v-if="open"
      class="fixed inset-0 bg-black/40 z-20 md:hidden"
      @click="open = false"
    ></div>

    <!-- Main Area -->
    <div v-if="loggedIn" class="flex flex-col flex-1">
      <!-- Top Bar -->

      <header
        class="p-3 flex items-center justify-between bg-[#49215D] text-white"
      >
        <button class="md:hidden text-xl" @click="open = true">☰</button>

        <div class="text-lg font-bold uppercase">Zemen Bet</div>

        <div class="text-sm opacity-80">{{ user?.role }}</div>
      </header>

      <!-- Content -->

      <main
        class="flex-1 overflow-y-auto overscroll-contain border-x-4 border-gray-100 p-1"
      >
        <slot />
        <div class="h-40"></div>
      </main>
    </div>
  </div>

  <LoginModal />
</template>

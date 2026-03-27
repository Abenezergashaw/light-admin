<script setup>
const { call } = useApi();
const { user } = useAuth();

const users = ref([]);
const total = ref(0);
const page = ref(1);
const limit = 10;
const search = ref("");

/* creation state */
const createRole = ref("");
const username = ref("");
const password = ref("");
const creating = ref(false);

const roleOptions = computed(() => {
  if (!user.value) return [];

  if (user.value?.role === "admin") {
    return ["agent", "cashier"];
  }

  if (user.value?.role === "agent") {
    return ["agent", "cashier"];
  }

  return [];
});

const createUser = async () => {
  if (!createRole.value || !username.value || !password.value) return;

  creating.value = true;

  try {
    await call({
      url: "/api/users/create",
      method: "POST",
      data: {
        role: createRole.value,
        username: username.value,
        password: password.value,
      },
      credentials: true,
    });
    username.value = "";
    password.value = "";

    await fetchUsers();
    alert(createRole.value + " created successfully");
  } catch (error) {
    console.log(error.message);
    alert(error.message);
  } finally {
    creating.value = false;
  }
};

const fetchUsers = async () => {
  const res = await call({
    url: "/api/users/get-direct-children",
    method: "GET",
    params: {
      page: page.value,
      limit,
      search: search.value,
    },
    credentials: true,
  });

  users.value = res.childs.users;
  total.value = res.childs.total;
};

watch(
  () => user.value,
  async (newUser) => {
    if (newUser && newUser.id) {
      await fetchUsers();
    }
  },
  { immediate: true },
);

watch(page, fetchUsers);

watch(search, () => {
  page.value = 1;
  fetchUsers();
});

const totalPages = computed(() => Math.ceil(total.value / limit));
</script>

<template>
  <div class="p-3 space-y-4">
    <!-- create user -->
    <div v-if="roleOptions.length" class="border rounded p-3 space-y-3">
      <div class="font-semibold">Create User</div>

      <div class="flex flex-col md:flex-row gap-2">
        <select v-model="createRole" class="border rounded px-3 py-2">
          <option value="">Select role</option>
          <option v-for="r in roleOptions" :key="r" :value="r">
            {{ r }}
          </option>
        </select>

        <input
          v-model="username"
          placeholder="Username"
          class="border rounded px-3 py-2"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="border rounded px-3 py-2"
        />

        <button
          @click="createUser"
          :disabled="creating"
          class="bg-[#49215D] text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>
    </div>

    <!-- search -->
    <div class="flex gap-2">
      <input
        v-model="search"
        type="text"
        placeholder="Search username"
        class="flex-1 border rounded px-3 py-2"
      />
      <button
        @click="fetchUsers"
        class="bg-[#49215D] text-white px-3 py-2 rounded"
      >
        Search
      </button>
    </div>

    <!-- users list -->
    <UsersList :users="users" @fetchUsers="fetchUsers" />

    <!-- pagination -->
    <div class="flex justify-center gap-2 mt-2 text-sm">
      <button
        @click="page--"
        :disabled="page === 1"
        class="px-3 py-1 rounded border disabled:opacity-50"
      >
        Prev
      </button>

      <span>Page {{ page }} / {{ totalPages }}</span>

      <button
        @click="page++"
        :disabled="page === totalPages"
        class="px-3 py-1 rounded border disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
const { call } = useApi();

const users = ref([]);
const total = ref(0);
const total_online_users = ref(0);

const page = ref(1);
const limit = 10;
const search = ref("");

const fetchUsers = async () => {
  const res = await call({
    url: "/api/users/get-online-children",
    method: "GET",
    params: {
      page: page.value,
      limit,
      search: search.value,
    },
  });

  users.value = res.childs.users;
  total.value = res.childs.total;
  total_online_users.value = res.childs.total_online_users;
};

await fetchUsers();

watch(search, () => {
  page.value = 1;
  fetchUsers();
});

const handleAction = ({ action, user }) => {
  console.log(action, user);
};
</script>

<template>
  <div class="p-4 space-y-4">
    <input
      v-model="search"
      placeholder="Search username"
      class="w-full p-2 text-sm border rounded-md bg-gray-200 border-gray-300"
    />

    <div class="text-yellow-800">
      Total online users (registered online) : {{ total_online_users }}
    </div>

    <OnlineUsers
      :users="users"
      @action="handleAction"
      @gift_bonus="fetchUsers()"
    />

    <div class="flex justify-between items-center text-sm">
      <button
        class="px-3 py-1 bg-gray-300 rounded"
        :disabled="page === 1"
        @click="
          page--;
          fetchUsers();
        "
      >
        Prev
      </button>

      <span> Page {{ page }} </span>

      <button
        class="px-3 py-1 bg-gray-300 rounded"
        :disabled="page * limit >= total"
        @click="
          page++;
          fetchUsers();
        "
      >
        Next
      </button>
    </div>
  </div>
</template>

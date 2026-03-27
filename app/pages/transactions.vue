<script setup>
const { call } = useApi();
const { user } = useAuth();
const transactions = ref([]);
const total = ref(0);
const page = ref(1);
const limit = 10; // show 10 per page
const userId = 8; // example

const fetchTransactions = async () => {
  const res = await call({
    url: "/api/payment/history",
    method: "GET",
    params: { page: page.value, limit },
    credentials: true,
  });
  transactions.value = res.transactions.transactions;
  total.value = res.transactions.total;
};

watch(
  () => user.value,
  async (newUser) => {
    if (newUser && newUser.id) {
      await fetchTransactions();
    }
  },
  { immediate: true }, // Run immediately in case user is already there
);

// await fetchTransactions();

watch(page, fetchTransactions);

const totalPages = computed(() => Math.ceil(total.value / limit));
</script>

<template>
  <div class="p-3 space-y-3">
    <h2 class="text-lg font-semibold mb-2">Transaction History</h2>

    <TransactionsTable :transactions="transactions" />

    <div class="flex justify-center gap-2 mt-3">
      <button
        @click="page--"
        :disabled="page === 1"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span>Page {{ page }} / {{ totalPages }}</span>

      <button
        @click="page++"
        :disabled="page === totalPages"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

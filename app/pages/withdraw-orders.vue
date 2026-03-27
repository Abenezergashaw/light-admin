<!-- pages/withdraws.vue -->
<script setup>
const { call } = useApi();

const orders = ref([]);
const loading = ref(false);

const fetchOrders = async () => {
  loading.value = true;

  try {
    const res = await call({
      url: "/payment/pending-withdraws",
      method: "GET",
    });

    if (!res.error) {
      orders.value = res.result;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
};

await fetchOrders();

const totalWithdraw = computed(() =>
  orders.value.reduce((acc, o) => acc + Number(o.requested_amount), 0),
);

const handleAction = async ({ id, action }) => {
  console.log("Order:", id, "Action:", action);

  if (action === "approve") {
    await call({
      url: "/payment/withdraw-approve",
      method: "POST",
      data: { adminId: 8, id },
    });
  } else if (action === "cancel") {
    await call({
      url: "/payment/withdraw-cancel",
      method: "POST",
      data: { adminId: 8, id },
    });
  }
  // example future api
  /*
  
  */

  //   orders.value = orders.value.filter((o) => o.id !== id);
};
</script>

<template>
  <div class="p-4 space-y-4">
    <h1 v-if="totalWithdraw > 0" class="text-lg font-semibold text-gray-700">
      Total Withdrawable Amount: ETB {{ totalWithdraw.toFixed(2) }}
    </h1>
    <h1 class="text-lg font-semibold text-gray-700">Pending Withdraw Orders</h1>

    <div v-if="loading" class="text-sm text-gray-500">Loading...</div>

    <WithdrawOrders v-else :orders="orders" @action="handleAction" />
  </div>
</template>

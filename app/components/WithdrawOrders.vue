<!-- components/WithdrawOrders.vue -->
<script setup>
const props = defineProps({
  orders: Array,
});

const emit = defineEmits(["action"]);

const doAction = (id, action) => {
  emit("action", { id, action });
};
</script>

<template>
  <div
    v-if="orders.length === 0"
    class="flex p-3 justify-center items-center text-green-500"
  >
    No orders
  </div>
  <div v-else class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="o in orders"
      :key="o.id"
      class="rounded-xl border border-gray-300 bg-gray-200 shadow-sm overflow-hidden"
    >
      <!-- header -->
      <div class="flex justify-between items-center px-3 py-2 bg-gray-300">
        <div>
          <p class="text-sm font-semibold text-gray-800">
            {{ o.username }}
          </p>
          <p class="text-[11px] text-gray-600">User ID {{ o.user_id }}</p>
        </div>

        <span class="text-[10px] px-2 py-1 bg-gray-800 text-white rounded">
          #{{ o.id }}
        </span>
      </div>

      <!-- info -->
      <div class="p-3 space-y-1 text-xs">
        <div class="flex justify-between">
          <span class="text-gray-500">Requested</span>
          <span class="font-semibold text-gray-800">
            {{ o.requested_amount }}
          </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">Balance</span>
          <span class="text-gray-700">
            {{ o.current_user_balance }}
          </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">Provider</span>
          <span class="text-gray-700 uppercase">
            {{ o.provider }}
          </span>
        </div>

        <div class="text-[11px] text-gray-600">
          {{ o.paymentDetails?.via }}
        </div>

        <div class="text-[10px] text-gray-500">
          {{ o.created_at }}
        </div>
      </div>

      <!-- actions -->
      <div class="grid grid-cols-3 gap-[1px] bg-gray-300">
        <button
          class="bg-green-500 text-[11px] py-2 hover:bg-green-300"
          @click="doAction(o.id, 'approve')"
        >
          Approve
        </button>

        <button
          class="bg-red-200 text-[11px] py-2 hover:bg-red-300"
          @click="doAction(o.id, 'cancel')"
        >
          Cancel
        </button>

        <button
          class="bg-gray-100 text-[11px] py-2 hover:bg-gray-200"
          @click="doAction(o.id, 'ignore')"
        >
          Ignore
        </button>
      </div>
    </div>
  </div>
</template>

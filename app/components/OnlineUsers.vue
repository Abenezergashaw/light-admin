<script setup>
const props = defineProps({
  users: Array,
});

const { call } = useApi();

const showModal = ref(false);
const currentUser = ref(null);
const currentAction = ref("");

const handleAction = (user, action) => {
  currentUser.value = user;
  currentAction.value = action;
  showModal.value = true;
};

const emit = defineEmits(["action", "gift_bonus"]);

const act = (type, user) => {
  emit("action", { action: type, user });
};

const confirmAction = async (amount) => {
  console.log(amount, currentUser.value, currentAction.value);
  try {
    const res = await call({
      url: "/api/users/gift-bonus",
      method: "POST",
      data: {
        adminId: 8,
        userId: currentUser.value.user_id,
        amount,
      },
      credentials: true,
    });

    emit("gift_bonus");
    alert("Successfully gifted");
  } catch (error) {
    alert(error.message);
  }
};
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <div
      v-for="u in users"
      :key="u.user_id"
      class="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col"
    >
      <!-- header -->

      <div
        class="flex items-center justify-between px-4 py-3 border-b bg-gray-50"
      >
        <div>
          <p class="text-sm font-semibold text-gray-800">
            {{ u.username }}
          </p>
          <p class="text-xs text-gray-500">
            {{ u.role }}
          </p>
        </div>

        <span class="text-[11px] bg-gray-200 px-2 py-1 rounded">
          #{{ u.user_id }}
        </span>
      </div>

      <!-- balances -->

      <div class="grid grid-cols-2 gap-3 p-4 text-xs">
        <div class="border rounded p-2 bg-blue-100">
          <p class="text-gray-500">Real Balance</p>
          <p class="font-semibold text-gray-800">
            {{ u.real_balance }}
          </p>
        </div>

        <div class="border rounded p-2 bg-blue-100">
          <p class="text-gray-500">Bonus Balance</p>
          <p class="font-semibold text-gray-800">
            {{ u.bonus_balance }}
          </p>
        </div>
      </div>

      <!-- totals -->

      <div class="grid grid-cols-2 gap-3 px-4 pb-3 text-xs">
        <div class="border rounded p-2 bg-green-100">
          <p class="text-gray-500">Deposits</p>
          <p class="font-semibold">
            {{ u.totals.total_deposits }}
          </p>
          <p class="text-[10px] text-gray-400">
            {{ u.totals.deposit_count }} tx
          </p>
        </div>

        <div class="border rounded p-2 bg-red-100">
          <p class="text-gray-500">Withdrawals</p>
          <p class="font-semibold">
            {{ u.totals.total_withdrawals }}
          </p>
          <p class="text-[10px] text-gray-400">
            {{ u.totals.withdrawal_count }} tx
          </p>
        </div>
      </div>

      <!-- first deposit -->

      <div
        v-if="u.first_deposit && u.gifted === 0"
        class="px-4 pb-3 text-xs border-t pt-3 bg-yellow-100"
      >
        <p class="text-gray-500">First Deposit</p>
        <div class="flex justify-between text-gray-700">
          <span>{{ u.first_deposit.amount }}</span>
          <span class="text-[10px] text-gray-400">
            {{ u.first_deposit.created_at }}
          </span>
        </div>
      </div>

      <!-- transactions -->

      <div class="px-4 pt-3 pb-4 border-t">
        <p class="text-xs font-semibold text-gray-700 mb-2">Transactions</p>

        <div class="space-y-1 max-h-36 overflow-y-auto">
          <div
            v-for="t in u.transactions"
            :key="t.created_at + t.amount"
            class="flex justify-between text-[11px] border rounded px-2 py-1"
          >
            <span
              :class="t.type === 'deposit' ? 'text-green-600' : 'text-red-600'"
            >
              {{ t.type }}
            </span>

            <span>{{ t.amount }}</span>

            <span class="text-gray-400">
              {{ t.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- actions -->

      <div class="grid grid-cols-5 border-t text-[11px]">
        <button
          class="py-2 hover:bg-gray-100 border-r"
          @click="$router.push(`/online-users/${u.user_id}`)"
        >
          View
        </button>

        <button
          class="py-2 hover:bg-gray-100 border-r"
          @click="act('deposit', u)"
        >
          Deposit
        </button>

        <button
          class="py-2 hover:bg-gray-100 border-r"
          @click="act('withdraw', u)"
        >
          Withdraw
        </button>

        <button
          v-if="u.first_deposit && u.gifted === 0"
          class="py-2 hover:bg-gray-100 border-r"
          @click="handleAction(u, 'give_bonus')"
        >
          Give Bonus
        </button>

        <button
          class="py-2 hover:bg-red-50 text-red-600"
          @click="act('block', u)"
        >
          Block
        </button>
      </div>
    </div>
  </div>

  <UserActionModal
    :show="showModal"
    :user="currentUser"
    :action="currentAction"
    @close="showModal = false"
    @confirm="confirmAction"
  />
</template>

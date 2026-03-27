<script setup>
const props = defineProps({
  users: Array,
});

const { user, checkSession } = useAuth();
const { call } = useApi();

const emit = defineEmits(["fetchUsers"]);

const showModal = ref(false);
const currentUser = ref(null);
const currentAction = ref(""); // "Deposit" or "Withdraw"

const handleAction = (user, action) => {
  currentUser.value = user;
  currentAction.value = action;
  showModal.value = true;
};

const confirmAction = async (amount) => {
  // call API here for deposit or withdraw
  console.log(
    currentAction.value,
    currentUser.value.username,
    amount,
    currentUser.value.user_id,
  );
  let res;
  try {
    if (currentAction.value === "Deposit") {
      res = await call({
        url: "/api/payment/transfer",
        method: "POST",
        data: {
          senderId: user?.value?.id,
          receiverId: currentUser.value.user_id,
          amount: amount,
        },
      });
    } else if (currentAction.value === "Withdraw") {
      res = await call({
        url: "/api/payment/collect",
        method: "POST",
        data: {
          receiverId: user?.value?.id,
          senderId: currentUser.value.user_id,
          amount: amount,
        },
      });
    }
    showModal.value = false;
    emit("fetchUsers");
    checkSession();
    alert("Successfull transaction");
  } catch (error) {
    alert(error.message);
  }
};

const updateUser = async (newPassword) => {
  console.log(newPassword, currentUser.value);
  if (!newPassword || !currentUser.value || newPassword === null) return;

  try {
    await call({
      url: "/api/users/update",
      method: "POST",
      data: {
        newPassword,
        userId: currentUser.value.user_id,
      },
      credentials: true,
    });
    showModal.value = false;
    emit("fetchUsers");
    checkSession();
    alert("Successfully updated password for " + currentUser.value.username);
  } catch (error) {
    alert(error.message);
  }
};
</script>

<template>
  <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="u in users"
      :key="u.user_id"
      class="rounded-xl bg-gray-200 border border-gray-300 shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <!-- header -->

      <div
        @click="$router.push(`/users/${u.user_id}`)"
        class="flex justify-between items-center px-3 py-2 bg-gray-300"
      >
        <div>
          <p class="text-sm font-semibold text-gray-800">
            {{ u.username }}
          </p>

          <p class="text-[11px] text-gray-600 uppercase">
            {{ u.role }}
          </p>
        </div>

        <span class="text-[10px] bg-gray-400 text-gray-900 px-2 py-0.5 rounded">
          ID {{ u.user_id }}
        </span>
      </div>

      <!-- balances -->

      <div class="grid grid-cols-2 gap-2 p-3 text-xs">
        <div class="bg-gray-100 rounded-md p-2 border border-gray-200">
          <p class="text-[10px] uppercase text-gray-500">Real Balance</p>

          <p class="font-semibold text-gray-800">
            {{ u.real_balance }}
          </p>
        </div>

        <div class="bg-gray-100 rounded-md p-2 border border-gray-200">
          <p class="text-[10px] uppercase text-gray-500">Bonus Balance</p>

          <p class="font-semibold text-gray-800">
            {{ u.bonus_balance }}
          </p>
        </div>
      </div>

      <!-- actions -->

      <!-- actions -->
      <div class="grid grid-cols-4 gap-[1px] bg-gray-300">
        <button
          @click="handleAction(u, 'Deposit')"
          class="bg-gray-100 text-[11px] py-2 hover:bg-gray-200 transition"
        >
          Deposit
        </button>

        <button
          @click="handleAction(u, 'Withdraw')"
          class="bg-gray-100 text-[11px] py-2 hover:bg-gray-200 transition"
        >
          Withdraw
        </button>
        <button
          @click="handleAction(u, 'Edit')"
          class="bg-gray-100 text-[11px] py-2 hover:bg-gray-200 transition"
        >
          Edit
        </button>
        <button
          class="bg-gray-100 text-[11px] py-2 hover:bg-red-200 transition"
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
    @updateUser="updateUser"
  />
</template>

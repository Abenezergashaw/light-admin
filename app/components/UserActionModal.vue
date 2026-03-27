<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  user: Object, // user to act on
  action: {
    // "Deposit" or "Withdraw"
    type: String,
    required: true,
  },
  show: Boolean, // whether modal is visible
});

const emit = defineEmits(["close", "confirm"]);

const amount = ref("");
const password = ref("");

// reset amount when modal opens
watch(
  () => props.show,
  (v) => {
    if (v) amount.value = "";
  },
);
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/40 z-40 flex items-center justify-center"
  >
    <div
      v-if="action === 'Edit'"
      class="bg-white rounded-xl w-80 p-5 shadow-lg"
    >
      <h3 class="text-lg font-semibold mb-3">
        {{ action }} {{ user.username }}
      </h3>

      <input
        v-model="password"
        type="password"
        min="0"
        placeholder="Enter password"
        class="w-full border rounded px-3 py-2 mb-4"
      />

      <div class="flex justify-end gap-2">
        <button
          class="px-3 py-1 rounded border hover:bg-gray-100"
          @click="$emit('close')"
        >
          Cancel
        </button>

        <button
          class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          @click="$emit('updateUser', password)"
          :disabled="!password || password.length < 8"
        >
          Update {{ user.username }}
        </button>
      </div>
    </div>
    <div v-else="" class="bg-white rounded-xl w-80 p-5 shadow-lg">
      <h3 class="text-lg font-semibold mb-3">
        {{ action }} for {{ user.username }}
      </h3>

      <input
        v-model="amount"
        type="number"
        min="0"
        placeholder="Enter amount"
        class="w-full border rounded px-3 py-2 mb-4"
      />

      <div class="flex justify-end gap-2">
        <button
          class="px-3 py-1 rounded border hover:bg-gray-100"
          @click="$emit('close')"
        >
          Cancel
        </button>

        <button
          class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          @click="$emit('confirm', Number(amount))"
          :disabled="!amount || Number(amount) <= 0"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

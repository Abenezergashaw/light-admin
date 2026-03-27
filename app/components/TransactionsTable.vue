<script setup>
const props = defineProps({
  transactions: Array,
});
</script>

<template>
  <div class="overflow-x-auto bg-gray-50 rounded-md border border-gray-200">
    <table class="min-w-full text-sm text-left">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-3 py-2">Date</th>
          <th class="hidden md:block px-3 py-2">Reference</th>
          <th class="px-3 py-2">Type</th>
          <th class="px-3 py-2">Amount</th>
          <th class="hidden md:block px-3 py-2">Balance After</th>
          <th class="px-3 py-2">Initiator</th>
          <th class="px-3 py-2">Target</th>
          <th class="hidden md:block px-3 py-2">Details</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="t in transactions"
          :key="t.transaction_id"
          class="border-b border-gray-200 hover:bg-gray-100"
        >
          <td class="px-3 py-2">{{ t.created_at }}</td>
          <td class="hidden md:block px-3 py-2">{{ t.reference_id }}</td>
          <td class="px-3 py-2">{{ t.type }}</td>
          <td class="px-3 py-2">{{ t.amount }}</td>
          <td class="hidden md:block px-3 py-2">{{ t.balance_after }}</td>
          <td class="px-3 py-2">{{ t.initiator || "-" }}</td>
          <td class="px-3 py-2">{{ t.target || "-" }}</td>
          <td class="hidden md:block px-3 py-2">{{ t.details || "-" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

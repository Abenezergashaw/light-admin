<script setup>
const props = defineProps({
  report: Object,
});

const statsMap = {};
props.report.result.statistics.forEach((s) => {
  statsMap[s.type] = s;
});
</script>

<template>
  <div class="border rounded-lg bg-white">
    <!-- Header -->

    <div class="border-b px-4 py-3 bg-gray-50 flex justify-between">
      <div>
        <p class="font-semibold text-gray-800">
          {{ report.result.username }}
        </p>

        <p class="text-xs text-gray-500">
          {{ report.result.role }}
        </p>
      </div>

      <div class="text-right text-xs">
        <p class="text-gray-500">Filter</p>
        <p class="font-medium">
          {{ report.filter }}
        </p>
      </div>
    </div>

    <!-- Balances -->

    <div class="grid grid-cols-2 gap-4 p-4 text-sm">
      <div class="border rounded p-3">
        <p class="text-gray-500 text-xs">Current Balance</p>
        <p class="font-semibold">
          {{ report.result.current_balance }}
        </p>
      </div>

      <div class="border rounded p-3">
        <p class="text-gray-500 text-xs">Bonus Balance</p>
        <p class="font-semibold">
          {{ report.result.bonus_balance }}
        </p>
      </div>
    </div>

    <!-- Statistics -->

    <div class="border-t">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-xs text-gray-600">
          <tr>
            <th class="text-left p-2">Type</th>
            <th class="text-right p-2">Count</th>
            <th class="text-right p-2">Amount</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="s in report.result.statistics"
            :key="s.type"
            class="border-t"
          >
            <td class="p-2 capitalize">
              {{ s.type.replace("_", " ") }}
            </td>

            <td class="p-2 text-right">
              {{ s.total_count }}
            </td>

            <td class="p-2 text-right font-medium">
              {{ s.total_amount }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

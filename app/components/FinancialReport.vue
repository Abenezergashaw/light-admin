<script setup>
const props = defineProps({
  report: Object,
  range: String,
});

const emit = defineEmits(["changeRange"]);

const router = useRouter();

const ranges = [
  { label: "Day", value: "day" },
  { label: "2 Days", value: "2day" },
  { label: "Week", value: "week" },
  { label: "2 Weeks", value: "2week" },
  { label: "Month", value: "month" },
];

const handleUserClick = (user) => {
  // Check the role before taking action
  if (user.role !== "player") {
    router.push(`/users/${user.user_id}`);
  } else {
    // Optionally alert or do nothing for players
    console.log("This is a player, no profile redirect.");
  }
};

const changeRange = (e) => {
  emit("changeRange", e.target.value);
};
</script>

<template>
  <div class="space-y-4">
    <!-- range select -->

    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-700">Financial Report</h2>

      <select
        class="border rounded px-3 py-1 text-sm bg-gray-100"
        :value="range"
        @change="changeRange"
      >
        <option v-for="r in ranges" :key="r.value" :value="r.value">
          {{ r.label }}
        </option>
      </select>
    </div>

    <!-- user summary -->
    <div class="space-y-2">
      <div class="bg-green-200 rounded p-4">
        <div class="flex justify-between text-sm">
          <div>
            <p class="font-semibold">
              {{ report.result.username }}
            </p>
            <p class="text-gray-600 text-xs">
              {{ report.result.role }}
            </p>
          </div>

          <div class="text-right text-xs">
            <p>Balance: {{ report.result.current_balance }}</p>
            <p>Bonus: {{ report.result.bonus_balance }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- totals -->

    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div class="bg-gray-200 p-3 rounded">
        <p class="text-xs text-gray-600">Total Bets</p>
        <p class="font-semibold">{{ report.total.total_bets }}</p>
      </div>

      <div class="bg-gray-200 p-3 rounded">
        <p class="text-xs text-gray-600">Total Wins</p>
        <p class="font-semibold">{{ report.total.total_wins }}</p>
      </div>

      <div class="bg-gray-200 p-3 rounded">
        <p class="text-xs text-gray-600">Net Bonus Wins</p>
        <p class="font-semibold">{{ report.total.total_team_bonus_wins }}</p>
      </div>

      <div class="bg-gray-200 p-3 rounded">
        <p class="text-xs text-gray-600">Net Refunds (Void Bets)</p>
        <p class="font-semibold">{{ report.total.total_team_refunds }}</p>
      </div>

      <div class="bg-gray-200 p-3 rounded">
        <p class="text-xs text-gray-600">Net Win WIth Bonus (Gift)</p>
        <p class="font-semibold">
          {{ report.total.total_team_wins_with_bonus }}
        </p>
      </div>

      <div class="bg-gray-200 p-3 rounded">
        <p class="text-xs text-gray-600">Net Cashbacks</p>
        <p class="font-semibold">{{ report.total.total_team_cashbacks }}</p>
      </div>

      <div class="bg-gray-200 p-3 rounded">
        <p class="text-xs text-gray-600">Net GGR</p>
        <p class="font-semibold">{{ report.total.net_ggr }}</p>
      </div>

      <div class="bg-gray-200 p-3 rounded">
        <p class="text-xs text-gray-600">Deposits</p>
        <p class="font-semibold">{{ report.total.total_deposits }}</p>
      </div>

      <div class="bg-gray-200 p-3 rounded">
        <p class="text-xs text-gray-600">Active Members</p>
        <p class="font-semibold">{{ report.total.active_members }}</p>
      </div>
    </div>

    <!-- children -->

    <div class="space-y-2">
      <h3 class="text-sm font-semibold text-blue-700">Child Accounts</h3>

      <div
        v-for="c in report.childs"
        :key="c.user_id"
        @click="handleUserClick(c)"
        class="flex justify-between items-center bg-blue-200 rounded p-3 text-sm"
      >
        <div>
          <p class="font-semibold">{{ c.username }}</p>
          <p class="text-xs text-gray-600">{{ c.role }}</p>
        </div>

        <div class="text-right text-xs">
          <p>Real: {{ c.real_balance }}</p>
          <p>Bonus: {{ c.bonus_balance }}</p>
        </div>
      </div>
    </div>

    <!-- statistics -->
    <div class="space-y-2">
      <h3 class="text-sm font-semibold text-red-700">Actions</h3>
      <div class="grid md:grid-cols-2 gap-3">
        <div
          v-for="s in report.result.statistics"
          :key="s.type"
          class="bg-red-100 rounded p-3 text-sm"
        >
          <p class="text-xs text-gray-600 uppercase">
            {{ s.type }}
          </p>

          <p>Count: {{ s.total_count }}</p>
          <p>Amount: {{ s.total_amount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

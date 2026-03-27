<script setup>
const props = defineProps({
  report: Object,
});

const emit = defineEmits(["changeFilter"]);
const filter = ref(props.report.filter);
const options = ["day", "2day", "week", "2week", "month"];

watch(filter, (v) => {
  emit("changeFilter", v);
});

// Logical grouping for the UI
const groupings = computed(() => {
  const g = props?.report?.ggr;

  return [
    {
      title: "Real Balance Activity",
      items: [
        {
          label: "Bets (In)",
          value: g?.global_bets ?? 0,
          color: "text-blue-700 bg-blue-50 border-blue-100",
        },
        {
          label: "Wins (Out)",
          value: g?.global_wins ?? 0,
          color: "text-red-700 bg-red-50 border-red-100",
        },
        {
          label: "Bonus Wins",
          value: g?.global_bonus_wins ?? 0,
          color: "text-indigo-700 bg-indigo-50 border-indigo-100",
        },
        {
          label: "Refunds",
          value: g?.global_refunds ?? 0,
          color: "text-gray-600 bg-gray-50 border-gray-100",
        },
        {
          label: "Cashback",
          value: g?.global_cashback ?? 0,
          color: "text-amber-700 bg-amber-50 border-amber-100",
        },
      ],
    },
    {
      title: "Cash Flow (External)",
      items: [
        {
          label: "Deposits",
          value: g?.global_deposits ?? 0,
          color: "text-emerald-700 bg-emerald-50 border-emerald-100",
        },
        {
          label: "Withdrawals",
          value: g?.global_withdrawals ?? 0,
          color: "text-orange-700 bg-orange-50 border-orange-100",
        },
      ],
    },
    {
      title: "Total Transfers from admin(to admin)",
      items: [
        {
          label: "From admin (transfer out) (+)",
          value: g?.global_transfer_out ?? 0,
          color: "text-pink-700 bg-pink-50 border-pink-100",
        },
        {
          label: "To admin (transfer in) (-)",
          value: g?.global_transfer_in ?? 0,
          color: "text-pink-700 bg-pink-50 border-pink-100",
        },
      ],
    },
    {
      title: "Bonus & Incentives",
      items: [
        {
          label: "Bonus Given",
          value: g?.global_bonus_given ?? 0,
          color: "text-indigo-700 bg-indigo-50 border-indigo-100",
        },
        {
          label: "Bonus Bets",
          value: g?.global_bonus_bets ?? 0,
          color: "text-purple-700 bg-purple-50 border-purple-100",
        },
        {
          label: "Wins with Bonus",
          value: g?.global_wins_with_bonus ?? 0,
          color: "text-indigo-700 bg-indigo-50 border-indigo-100",
        },
      ],
    },
  ];
});
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex items-center justify-between bg-[#49215D] p-3 rounded-xl shadow-sm border border-gray-100"
    >
      <div>
        <h2 class="text-sm font-bold text-gray-100">Dashboard</h2>
      </div>
      <select
        v-model="filter"
        class="text-xs font-medium border-none bg-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
      >
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
    </div>

    <div v-for="group in groupings" :key="group.title" class="space-y-3">
      <h3
        class="text-[12px] font-bold text-gray-800 uppercase tracking-widest px-1"
      >
        {{ group.title }}
      </h3>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div
          v-for="item in group.items"
          :key="item.label"
          class="p-3 rounded-2xl border transition-all active:scale-95"
          :class="item.color"
        >
          <p class="text-[12px] uppercase font-bold opacity-60 mb-1">
            {{ item.label }}
          </p>
          <p class="text-base font-black">
            {{ Number(item.value).toLocaleString() }}
            <span class="text-[10px]">ETB</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

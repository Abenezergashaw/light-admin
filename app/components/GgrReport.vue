<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  report: Object,
});

const emit = defineEmits(["changeFilter", "loadCustomRange"]);

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// State
const filter = ref(props.report?.filter || "day");
const fromDate = ref(getTodayString());
const toDate = ref(getTodayString());

// Preset options (No longer contains 'custom')
const options = ["day", "2day", "week", "2week", "month"];

// Watch for preset changes
watch(filter, (v) => {
  emit("changeFilter", v);
});

// Logic for the Load button
const handleLoadCustom = () => {
  if (!fromDate.value || !toDate.value) {
    alert("Please select both 'From' and 'To' dates.");
    return;
  }

  // Validation: To must be greater than From
  if (new Date(toDate.value) < new Date(fromDate.value)) {
    alert("Invalid Range: The 'To' date must be after the 'From' date.");
    return;
  }

  emit("loadCustomRange", {
    from: fromDate.value,
    to: toDate.value,
  });
};

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
      title: "Total Transfers",
      items: [
        {
          label: "From admin (+)",
          value: g?.global_transfer_out ?? 0,
          color: "text-pink-700 bg-pink-50 border-pink-100",
        },
        {
          label: "To admin (-)",
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
    <!-- Header Section -->
    <div
      class="bg-[#49215D] p-4 rounded-xl shadow-md border border-purple-900/20"
    >
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <!-- Dashboard Title -->
        <div>
          <h2
            class="h-full flex items-center text-sm font-bold text-white uppercase tracking-tight"
          >
            Dashboard Reports
          </h2>
        </div>

        <!-- Controls Container -->
        <div class="flex flex-wrap items-end gap-4">
          <!-- 1. Custom Date Range Selector (Always Visible) -->
          <div
            class="flex items-end gap-2 bg-purple-800/30 p-2 rounded-lg border border-white/10"
          >
            <div class="flex flex-col">
              <label
                class="text-[9px] text-white/60 ml-1 uppercase font-bold mb-1"
                >From</label
              >
              <input
                v-model="fromDate"
                type="date"
                class="text-xs p-1.5 rounded-lg border-none bg-white focus:ring-2 focus:ring-emerald-400 w-[130px]"
              />
            </div>
            <div class="flex flex-col">
              <label
                class="text-[9px] text-white/60 ml-1 uppercase font-bold mb-1"
                >To</label
              >
              <input
                v-model="toDate"
                type="date"
                class="text-xs p-1.5 rounded-lg border-none bg-white focus:ring-2 focus:ring-emerald-400 w-[130px]"
              />
            </div>
            <button
              @click="handleLoadCustom"
              class="bg-gray-200 hover:bg-gray-300 active:scale-95 text-black text-[11px] font-black px-4 py-2 rounded-lg shadow-lg transition-all"
            >
              LOAD
            </button>
          </div>

          <!-- 2. Vertical Divider (Desktop Only) -->
          <div class="hidden lg:block w-[1px] h-10 bg-white/10"></div>

          <!-- 3. Preset Quick Select -->
          <div class="flex flex-col">
            <label
              class="text-[9px] text-white/60 ml-1 uppercase font-bold mb-1"
              >Quick Presets</label
            >
            <select
              v-model="filter"
              class="text-xs font-bold border-none bg-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 min-w-[120px]"
            >
              <option v-for="o in options" :key="o" :value="o">
                {{ o.toUpperCase() }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Groups -->
    <div v-for="group in groupings" :key="group.title" class="space-y-3">
      <h3
        class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1"
      >
        {{ group.title }}
      </h3>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          v-for="item in group.items"
          :key="item.label"
          class="p-4 rounded-2xl border transition-all hover:shadow-md active:scale-95 flex flex-col justify-between min-h-[90px]"
          :class="item.color"
        >
          <p class="text-[10px] uppercase font-bold opacity-70 leading-tight">
            {{ item.label }}
          </p>
          <div class="mt-2 flex items-baseline gap-1">
            <p class="text-lg font-black tracking-tight">
              {{ Number(item.value).toLocaleString() }}
            </p>
            <span class="text-[9px] font-bold opacity-50">ETB</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
</style>

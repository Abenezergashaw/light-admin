<script setup>
const props = defineProps({
  bets: Array,
});

const emit = defineEmits(["settle"]);

const action = (id, type) => {
  emit("settle", { id, action: type });
};
</script>

<template>
  <div
    v-if="bets.length === 0"
    class="flex p-3 justify-center items-center text-red-500"
  >
    No unsettled selections
  </div>
  <div v-else class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="b in bets"
      :key="b.id"
      class="bg-gray-200 border border-blue-500 rounded-xl overflow-hidden shadow-sm"
    >
      <!-- header -->

      <div class="bg-gray-300 px-3 py-2 flex justify-between items-center">
        <p class="text-xs font-semibold text-gray-800">
          {{ b.ticket_id }}
        </p>

        <span class="text-[10px] bg-gray-400 px-2 py-0.5 rounded">
          ID {{ b.id }}
        </span>
      </div>

      <!-- match -->

      <div class="p-3 space-y-1">
        <p class="text-sm font-medium text-gray-800">
          {{ b.event_name }}
        </p>

        <p class="text-xs text-gray-600">
          {{ b.competition }}
        </p>

        <div class="flex justify-between text-xs text-gray-700">
          <span>{{ b.market_name }}</span>
          <span class="font-semibold">{{ b.price_name }}</span>
        </div>

        <div class="flex justify-between text-xs text-gray-700">
          <span>Odds</span>
          <span class="font-semibold">{{ b.price_rate }}</span>
        </div>

        <div class="text-[11px] text-gray-500">
          {{ b.start_time }}
        </div>
      </div>

      <!-- actions -->

      <div class="grid grid-cols-3 gap-[1px] bg-gray-300">
        <button
          class="bg-green-200 text-[11px] py-2 hover:bg-green-300"
          @click="action(b.id, 'won')"
        >
          Win
        </button>

        <button
          class="bg-red-200 text-[11px] py-2 hover:bg-red-300"
          @click="action(b.id, 'lost')"
        >
          Lose
        </button>

        <button
          class="bg-gray-100 text-[11px] py-2 hover:bg-gray-200"
          @click="action(b.id, 'void')"
        >
          Void
        </button>
      </div>
    </div>
  </div>
</template>

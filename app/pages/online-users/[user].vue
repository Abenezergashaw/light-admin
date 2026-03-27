<script setup>
const props = defineProps({
  userId: Number,
});

const { call } = useApi();

const route = useRoute();

const user = route.params.user;

const range = ref("day");
const report = ref(null);
const loading = ref(false);

const ranges = ["day", "2day", "week", "2week", "month"];

const fetchReport = async () => {
  loading.value = true;

  try {
    const res = await call({
      url: "/api/financial-report",
      method: "POST",
      data: {
        userId: user,
        range: range.value,
      },
    });

    report.value = res.report;
  } catch (err) {
    console.error(err);
  }

  loading.value = false;
};

onMounted(fetchReport);
</script>

<template>
  <div class="space-y-4">
    <!-- Range Selector -->

    <div class="flex items-center gap-3">
      <p class="text-sm font-medium text-gray-700">Range</p>

      <select
        v-model="range"
        @change="fetchReport"
        class="border rounded px-2 py-1 text-sm"
      >
        <option v-for="r in ranges" :key="r" :value="r">
          {{ r }}
        </option>
      </select>
    </div>

    <!-- Loader -->

    <div v-if="loading" class="text-sm text-gray-500">Loading report...</div>

    <!-- Report -->

    <PlayerFinancialReport v-if="report" :report="report" />
  </div>
</template>

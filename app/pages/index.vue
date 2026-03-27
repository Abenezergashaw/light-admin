<script setup>
const { call } = useApi();
const { user } = useAuth();

const totalData = ref(null);

const range = ref("day");

const fetchReport = async (range) => {
  const res = await call({
    url: "/api/financial-report",
    method: "POST",
    data: {
      range,
      userId: user?.value?.id,
    },
    // credentials: true,
  });

  totalData.value = res;
};

watch(
  () => user.value,
  async (newUser) => {
    if (newUser && newUser.id) {
      await fetchReport("day");
    }
  },
  { immediate: true }, // Run immediately in case user is already there
);

const handleFilter = async (range) => {
  await fetchReport(range);
};

const handleRange = async (r) => {
  range.value = r;
  console.log(r, "rrrr");
  await fetchReport(r);
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "ETB", // Change to 'ETB', 'EUR', etc.
});
</script>

<template>
  <div class="p-2 space-y-6">
    <div class="flex justify-between items-center">
      <div class="bg-green-100 text-green-900 p-3 rounded-xl">
        {{ user?.username }}
      </div>
      <div class="bg-orange-200 text-orange-900 p-3 rounded-xl">
        {{ formatter.format(user?.rBalance || 0) }}
      </div>
    </div>
    <GgrReport
      v-if="totalData && user?.role === 'admin'"
      :report="totalData.report"
      @changeFilter="handleFilter"
    />

    <FinancialReport
      v-if="totalData && user?.role === 'agent'"
      :report="totalData.report"
      :range="range"
      @changeRange="handleRange"
    />
  </div>
</template>

<script setup>
const { call } = useApi();

const report = ref(null);
const range = ref("day");

const route = useRoute();

const user = route.params.user;
console.log(user);

const fetchReport = async (from = null, to = null) => {
  const res = await call({
    url: "/api/financial-report",
    method: "POST",
    data: {
      userId: user,
      range: range.value,
      from,
      to,
    },
    credentials: true,
  });

  if (!res.error) {
    report.value = res.report;
  }
};

const handleLoadCustomRange = async ({ from, to }) => {
  console.log("Loading custom range:", from, to);
  await fetchReport(from, to);
};

await fetchReport();

const handleRange = async (r) => {
  range.value = r;
  await fetchReport();
};
</script>

<template>
  <div class="p-4 space-y-4">
    <FinancialReport
      v-if="report"
      :report="report"
      :range="range"
      @changeRange="handleRange"
      @loadCustomRange="handleLoadCustomRange"
    />
  </div>
</template>

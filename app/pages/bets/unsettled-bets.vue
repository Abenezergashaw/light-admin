<script setup>
const { call } = useApi();

const bets = ref([]);

const handleCallBets = async () => {
  const res = await call({
    url: "/api/get-unsettled-selections",
    method: "GET",
  });

  bets.value = res.result;
};

await handleCallBets();

const handleSettle = async ({ id, action }) => {
  console.log(id, action);

  //   let status = 'lost'
  //   if(action ==='win'){}

  try {
    await call({
      url: "/api/settle-manually",
      method: "POST",
      data: { id, status: action },
      credentials: true,
    });
    alert("Bet settled");
    await handleCallBets();
  } catch (error) {
    alert(error.message);
  }
};
</script>

<template>
  <div class="p-4 space-y-2">
    <h1 class="text-lg font-semibold text-gray-700 text-center">
      Unsettled Selections
    </h1>

    <UnsettledList :bets="bets" @settle="handleSettle" />
  </div>
</template>

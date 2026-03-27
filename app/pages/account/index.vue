<script setup>
const { call } = useApi();

const account = ref(null);

const form = ref({
  phone: "",
  name: "",
});

const loading = ref(false);

const fetchAccount = async () => {
  const res = await call({
    url: "/api/get-account",
    method: "GET",
    credentials: true,
  });

  account.value = res.result;

  form.value.phone = account.value.phone;
  form.value.name = account.value.name;
};

const updateAccount = async () => {
  console.log(form.value.phone, form.value.name);
  try {
    const res = await call({
      url: "/api/update-account",
      method: "POST",
      credentials: true,
      data: {
        phone: form.value.phone.toString(),
        name: form.value.name,
      },
    });
    alert("Successfully updated");
  } catch (error) {
    alert(error.message);
  } finally {
    account.value = res.result;
    loading.value = false;
  }
};

await fetchAccount();
</script>

<template>
  <div v-if="account" class="p-6 max-w-md space-y-6">
    <div class="space-y-2">
      <div><strong>ID:</strong> {{ account.id }}</div>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm">Phone</label>
        <input v-model="form.phone" class="border p-2 w-full" type="text" />
      </div>

      <div>
        <label class="block text-sm">Name</label>
        <input v-model="form.name" class="border p-2 w-full" type="text" />
      </div>

      <button
        @click="updateAccount"
        :disabled="loading"
        class="px-4 py-2 bg-blue-600 text-white"
      >
        Save
      </button>
    </div>
  </div>
</template>

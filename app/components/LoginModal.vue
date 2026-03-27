<script setup>
import { ref, computed } from "vue";

// Props
defineProps({
  open: {
    type: Boolean,
    default: true,
  },
});

const { login, loginError, loggedIn } = useAuth();
const { loginModal, toggleModal } = useModal();

// Form state
const phone = ref("boss");
const password = ref("12345678");

// Computed to enable/disable login button
const isFormValid = computed(() => {
  return phone.value !== "" && password.value.trim() !== "";
});

// Function to handle form submission
const submitForm = () => {
  if (!isFormValid.value) return;

  const formData = {
    phone: phone.value,
    password: password.value,
  };

  login(formData);
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="!loggedIn"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black text-xs"
    >
      <div
        class="relative w-[90%] md:max-w-md rounded-md bg-[#49215D] text-white p-4 font-sans"
      >
        <!-- Close -->
        <button
          class="absolute right-3 top-3 text-lg font-bold text-white cursor-pointer"
          @click="toggleModal('login')"
        >
          ✕
        </button>

        <!-- Logo -->
        <div
          class="mb-4 text-center flex flex-col justify-center items-center gap-4 max-w-80"
        >
          <img src="/images/logo.png" alt="" class="h-20" />
        </div>

        <!-- Form -->
        <form class="space-y-2" @submit.prevent="submitForm">
          <!-- Phone -->
          <div>
            <div class="flex">
              <input
                type="text"
                v-model="phone"
                class="h-9 bg-[#f5f5f5] rounded text-black w-full rounded-r px-2 text-sm outline-none"
                placeholder="Username"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <input
              type="password"
              v-model="password"
              class="h-9 bg-[#f5f5f5] text-black w-full rounded px-2 text-sm outline-none"
              placeholder="Password"
            />
          </div>

          <!-- Login Button -->
          <button
            :disabled="!isFormValid"
            type="submit"
            class="mt-2 w-full rounded py-2 text-sm font-bold hover:opacity-75 transition-all duration-300"
            :class="
              isFormValid
                ? 'bg-orange-500 text-black cursor-pointer'
                : 'bg-[#1e042c] opacity-95 cursor-not-allowed'
            "
          >
            LOGIN
          </button>
        </form>

        <div class="text-red-500 text-xs textcenter my-2 text-center">
          {{ loginError }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

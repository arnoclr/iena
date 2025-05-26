<script lang="ts" setup>
import type { Congestion } from "../services/Wagon";

defineProps<{
  congestion: Congestion;
}>();

function getPersonCount(wagon: Congestion) {
  switch (wagon) {
    case "HIGH":
      return 3;
    case "MEDIUM":
      return 2;
    case "LOW":
      return 1;
  }
}
</script>

<template>
  <div class="person">
    <svg
      v-for="_ in getPersonCount(congestion)"
      width="25"
      height="110"
      viewBox="0 0 25 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 45.5C0 38.5964 5.59644 33 12.5 33V33C19.4036 33 25 38.5964 25 45.5V77H0V45.5Z"
        fill="white"
      />
      <ellipse cx="12.5" cy="14.5" rx="12.5" ry="14.5" fill="white" />
      <rect x="6" y="77" width="13" height="33" fill="white" />
    </svg>
  </div>
</template>

<style scoped>
.person {
  display: flex;
}

.person svg {
  height: 100%;
  width: auto;
}
</style>

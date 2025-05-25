<script lang="ts" setup>
defineProps<{
  severity: "HIGH" | "MEDIUM" | "LOW";
}>();
</script>

<template>
  <div class="labelRoot" :class="severity.toLocaleLowerCase()">
    <slot></slot>
  </div>
</template>

<style scoped>
.labelRoot {
  --border-radius: 1.36vh;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  display: flex;
  color: white;
  width: fit-content;
  padding: 1vh 2vh;
  font-size: 3vh;
}

.labelRoot.low {
  background-color: var(--equipment-background);
}

.labelRoot.medium {
  background-color: var(--worksite-background);
}

.labelRoot.high {
  background-color: var(--alert-background);
}
</style>

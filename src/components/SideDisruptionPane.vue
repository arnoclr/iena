<script lang="ts" setup>
defineProps<{
  disruptions: any[];
}>();
</script>

<template>
  <div>
    <aside></aside>
  </div>
</template>

<style scoped>
aside {
  height: 80vh;
  width: 100%;
  border-radius: 0 0.8vh 0.8vh 0;
  background-color: var(--worksite-background);
}
</style>

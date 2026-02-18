<script lang="ts" setup></script>

<template>
  <Transition name="fade" mode="out-in">
    <slot></slot>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-active {
  transition-delay: 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

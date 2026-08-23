<script lang="ts" setup>
withDefaults(
  defineProps<{
    direction?: "horizontal" | "vertical";
  }>(),
  {
    direction: "horizontal",
  },
);
</script>

<template>
  <Transition
    mode="out-in"
    :name="
      direction === 'vertical'
        ? 'panel-slide-vertical'
        : 'panel-slide-horizontal'
    "
  >
    <slot />
  </Transition>
</template>

<style>
.panel-slide-vertical-enter-active,
.panel-slide-vertical-leave-active,
.panel-slide-horizontal-enter-active,
.panel-slide-horizontal-leave-active {
  transition: transform 1.2s linear;
}

.panel-slide-horizontal-enter-from {
  transform: translateX(-100%);
}

.panel-slide-horizontal-leave-to {
  transform: translateX(-100%);
}

.panel-slide-vertical-enter-from {
  transform: translateY(100%);
}

.panel-slide-vertical-leave-to {
  transform: translateY(100%);
}
</style>
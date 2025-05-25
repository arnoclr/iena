<script lang="ts" setup>
import { Strings } from "../Helpers";
import type { SimpleStop } from "../services/Wagon";

defineProps<{
  stop: SimpleStop;
  color: string;
  tags: Set<"CLOSED" | "FIRST_OF_LIST" | "TERMINUS">;
}>();
</script>

<template>
  <div :style="{ '--color': color }">
    <article>
      <div class="path"></div>
      <div class="dot"></div>
      <span>{{ Strings.limit(Strings.abbreviate(stop.name), 24) }}</span>
    </article>
  </div>
</template>

<style scoped>
article {
  position: relative;
  break-inside: avoid;
  display: flex;
  align-items: center;
  gap: 2vh;
}

.path {
  height: 6vh;
  width: 1.7vh;
  background-color: var(--color);
}

.dot {
  width: 1.7vh;
  height: 1.7vh;
  background-color: black;
  border: 0.5vh solid var(--color);
  border-radius: 50%;
  position: absolute;
  transform: translateX(-17%);
}

span {
  font-size: 4.6vh;
  color: var(--text);
}
</style>

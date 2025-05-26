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
      <div class="dot" v-if="!tags.has('CLOSED')"></div>
      <svg
        v-if="tags.has('CLOSED')"
        class="xmark"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path
          d="M256-181.91 181.91-256l224-224-224-224L256-778.09l224 224 224-224L778.09-704l-224 224 224 224L704-181.91l-224-224-224 224Z"
        />
      </svg>
      <span :class="{ gray: tags.has('CLOSED') }">{{
        Strings.limit(Strings.abbreviate(stop.name), 19)
      }}</span>
      <span class="deleted" v-if="tags.has('CLOSED')">Supprimé</span>
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

.xmark {
  position: absolute;
  width: 5vh;
  height: 5vh;
  transform: translateX(-30%);
  fill: var(--high-congestion);
}

span {
  font-size: 4.6vh;
  color: var(--text);
}

span.gray {
  opacity: 0.5;
}

.deleted {
  padding: 0.2vh 0.5vh;
  position: absolute;
  right: 2vh;
  border-radius: 0.4vh;
  font-size: 2.5vh;
  color: var(--text);
  background-color: var(--alert-background);
}
</style>

<script lang="ts" setup>
import type { Congestion } from "../services/Wagon";
import MiniCongestion from "./MiniCongestion.vue";

defineProps<{
  wagons: Congestion[][];
}>();

function congestionClass(wagon: Congestion) {
  return wagon.toLowerCase();
}
</script>

<template>
  <div class="groups">
    <div class="wagons" v-for="group in wagons">
      <div
        class="wagon"
        v-for="(wagon, i) in group"
        :class="congestionClass(wagon)"
      >
        <svg
          v-if="i === 0"
          width="247"
          height="167"
          viewBox="0 0 247 167"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M67.4999 5.5H246L246 161.5C192 161.333 78.804 161.5 58.0002 161.5C28.5002 161.5 6.54675 143 5.99987 108C5.19987 56.8 46 5.5 67.4999 5.5Z"
            fill="currentColor"
          />
          <path
            d="M246 5.5H67.4999C46 5.5 5.19987 56.8 5.99987 108C6.54675 143 28.5002 161.5 58.0002 161.5C78.804 161.5 192 161.333 246 161.5"
            stroke="white"
            stroke-width="10"
          />
        </svg>
        <svg
          v-else-if="i !== group.length - 1"
          width="244"
          height="166"
          viewBox="0 0 244 166"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- not working -->
          <rect y="5" width="243" height="156" fill="currentColor" />
          <path
            d="M243 5H0.00630946M0 161C28.3204 161 169.489 160.833 243 161"
            stroke="white"
            stroke-width="10"
          />
        </svg>
        <svg
          v-else
          width="246"
          height="167"
          viewBox="0 0 246 167"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M115.506 5.5H0.00648499L0.00617981 161.5C54.0062 161.333 167.202 161.5 188.006 161.5C217.506 161.5 239.461 143 240.006 108C240.716 62.5 170 5.5 115.506 5.5Z"
            fill="currentColor"
          />
          <path
            d="M0.00648499 5.5H115.506C170 5.5 240.716 62.5 240.006 108C239.461 143 217.506 161.5 188.006 161.5C167.202 161.5 54.0062 161.333 0.00617981 161.5"
            stroke="white"
            stroke-width="10"
          />
          <path d="M164 99.5V35C193.2 54.2 222 85 226 99.5H164Z" fill="white" />
        </svg>

        <MiniCongestion
          class="person"
          :congestion="wagon"
          :style="{
            '--x-offset':
              i === 0 ? '35%' : i === group.length - 1 ? '-60%' : '0',
          }"
        >
        </MiniCongestion>
      </div>
    </div>
  </div>
</template>

<style scoped>
.groups {
  width: fit-content;
  display: flex;
  gap: 0.6vh;
}

.wagons {
  display: flex;
  gap: 0.5vh;
}

.wagon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.person {
  height: 70%;
  position: absolute;
  display: flex;
  gap: 0.2vh;
  transform: translateX(var(--x-offset, 0));
}

svg {
  height: 100%;
  width: auto;
}

.high svg {
  color: var(--high-congestion);
}

.medium svg {
  color: var(--medium-congestion);
}

.low svg {
  color: var(--low-congestion);
}
</style>

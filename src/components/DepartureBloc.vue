<script lang="ts" setup>
import type { SimpleDeparture, SimpleLine } from "../services/Wagon";
import LineDirection from "./LineDirection.vue";

const props = defineProps<{
  departure: SimpleDeparture;
  line: SimpleLine;
}>();
</script>

<template>
  <article>
    <div class="bloc">
      <LineDirection
        :number-shape-svg="line.numberShapeSvg"
        :direction="departure.destination.name"
        :journey-code="departure.journeyCode"
        :leaves-at="departure.leavesAt"
      ></LineDirection>
    </div>
    <div class="platform" v-if="departure.platform">
      {{ departure.platform }}
    </div>
  </article>
</template>

<style scoped>
article {
  --border-radius: 1.36vh;
  display: flex;
  align-items: start;
  gap: -0.5vh;
}

.bloc {
  background-color: #171a3c;
  border-radius: var(--border-radius);
  padding: 2vh;
  width: 100%;
}

.platform {
  background-color: white;
  color: #171a3c;
  border: calc(var(--border-radius) / 2) solid #171a3c;
  padding: 1.3vh 2.6vh;
  font-weight: bold;
  font-size: 6vh;
  border-radius: 0 1vh 1vh 0;
  border-left: none;
  box-shadow: calc(-1 * var(--border-radius)) 0 0 0 #171a3c;
}
</style>

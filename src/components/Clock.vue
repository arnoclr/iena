<script lang="ts" setup>
import dayjs from "dayjs";
import { onMounted, onUnmounted, ref } from "vue";

const currentTime = ref(dayjs());
let interval = 0;

const updateTime = () => {
  currentTime.value = dayjs();
};

onMounted(() => {
  updateTime();
  interval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="clock">
    <span class="numbers">
      <span>{{ currentTime.format("HH") }}</span>
      <span class="dots">:</span>
      <span>{{ currentTime.format("mm") }}</span>
    </span>
  </div>
</template>

<style scoped>
.clock {
  width: fit-content;
  height: 6vh;
  padding: 0 2vh;
  display: grid;
  place-items: center;
  background-color: white;
  color: black;
  border-radius: 2vh;
  font-size: 5vh;
  font-weight: bold;
}

.numbers {
  transform: translateY(0.3vh);
  display: flex;
  gap: 0.4vh;
}

.dots {
  transform: translateY(-0.3vh);
  animation: blink 2s infinite steps(1);
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>

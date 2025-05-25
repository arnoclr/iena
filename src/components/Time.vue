<script lang="ts" setup>
import dayjs, { Dayjs } from "dayjs";
import { onMounted, onUnmounted, ref } from "vue";
import { localized } from "../language";

const props = defineProps<{
  time: Dayjs;
}>();
let interval: number | null = null;

const time = ref<{
  text: string;
  showMinutesLabel?: boolean;
  approaching?: boolean;
  atStop?: boolean;
}>({
  text: "",
  showMinutesLabel: false,
});

function updateTime() {
  const remainingMinutes = props.time.diff(dayjs(), "minutes");
  if (remainingMinutes > 59) {
    time.value = {
      text: props.time.format("HH:mm"),
    };
  } else {
    time.value = {
      text: remainingMinutes.toString(),
      showMinutesLabel: remainingMinutes >= 3,
      approaching: remainingMinutes < 3,
      atStop: remainingMinutes < 1,
    };
  }
}

onMounted(() => {
  updateTime();
  interval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>

<template>
  <span class="timeRoot">
    <span class="time">{{
      time.atStop
        ? localized({ fr: "à quai", en: "", es: "en el andén" })
        : time.approaching
        ? localized({ fr: "à l'approche", en: "approaching", es: "" })
        : time.text
    }}</span>
    <span class="min" v-if="time.showMinutesLabel">min</span>
  </span>
</template>

<style scoped>
.timeRoot {
  display: flex;
  font-size: 5vh;
  gap: 0.1ch;
}

span.min {
  color: #ccc;
}
</style>

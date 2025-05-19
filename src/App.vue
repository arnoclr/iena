<script setup lang="ts">
import DepartureBloc from "./components/DepartureBloc.vue";
import { SIMPLE_DEPARTURE, SIMPLE_JOURNEY, SIMPLE_LINE } from "./mock";
import { useLangStore } from "./stores/lang";

const langStore = useLangStore();

setInterval(() => {
  langStore.cycleLang();
}, 5000);
</script>

<template>
  <DepartureBloc
    :departure="SIMPLE_DEPARTURE"
    :line="SIMPLE_LINE"
    :journey="SIMPLE_JOURNEY"
  ></DepartureBloc>
</template>

<style scoped></style>

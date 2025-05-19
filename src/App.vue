<script setup lang="ts">
import DepartureBloc from "./components/DepartureBloc.vue";
import { SIMPLE_DEPARTURE, SIMPLE_LINE } from "./mock";
</script>

<template>
  <DepartureBloc
    :departure="SIMPLE_DEPARTURE"
    :line="SIMPLE_LINE"
  ></DepartureBloc>
</template>

<style scoped></style>

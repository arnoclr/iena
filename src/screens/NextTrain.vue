<script lang="ts" setup>
import Clock from "../components/Clock.vue";
import Congestion from "../components/Congestion.vue";
import Label from "../components/Label.vue";
import LineDirection from "../components/LineDirection.vue";
import SideDisruptionPane from "../components/SideDisruptionPane.vue";
import { localized } from "../language";
import type { SimpleJourney } from "../services/Wagon";

defineProps<{
  journey: SimpleJourney;
}>();
</script>

<template>
  <main>
    <Clock style="margin-left: 1vh"></Clock>
    <header>
      <h1 style="grid-area: nextTrain">
        {{
          localized({
            fr: "Prochain Train",
            en: "Next Train",
            es: "Proximo Tren",
          })
        }}
      </h1>
      <div
        style="
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 1vh;
          grid-area: platform;
        "
      >
        <span class="platformLabel">{{
          localized({ fr: "Quai", en: "Platform", es: "Anden" })
        }}</span>
        <div class="platform">
          <span>{{ journey.userStopDeparture.platform }}</span>
        </div>
      </div>
      <Label severity="LOW" style="grid-area: label; justify-self: end">
        <span v-if="journey.userStopDeparture.vehicleLength === 'LONG'">{{
          localized({ fr: "Train Long", en: "Long Train", es: "Tren Largo" })
        }}</span>
        <span v-else-if="journey.userStopDeparture.vehicleLength === 'SHORT'">{{
          localized({ fr: "Train Court", en: "Short Train", es: "Tren Corto" })
        }}</span>
      </Label>
    </header>
    <SideDisruptionPane :disruptions="[]"> </SideDisruptionPane>
    <div class="journey">
      <article>
        <LineDirection
          :line="journey.line"
          :direction="journey.userStopDeparture.destination.name"
          :journey-code="journey.userStopDeparture.journeyCode"
          :leaves-at="journey.userStopDeparture.leavesAt"
          :subtitle="
            localized({
              fr: 'Dessert',
              en: 'Stations',
              es: 'Estaciones',
            })
          "
        ></LineDirection>
      </article>
      <article v-if="journey.congestion">
        <h2>Crowding</h2>
        <div class="centered">
          <Congestion
            style="height: 8.8vh"
            :wagons="journey.congestion?.wagons"
          ></Congestion>
        </div>
        <span class="labels">
          <span
            >{{ localized({ fr: "Arrière", en: "Rear", es: "Atrás" }) }}
          </span>
          <span>{{
            localized({ fr: "Avant", en: "Front", es: "Delante" })
          }}</span>
        </span>
      </article>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 1vh;
  padding-left: 0;
  display: grid;
  column-gap: 1vh;
  grid-template-columns: 10fr 27fr;
}

header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1vh;
  grid-template-areas:
    "nextTrain platform"
    "nextTrain label";
}

h1 {
  margin: 0;
  font-size: 5vh;
  color: var(--background);
}

h2 {
  color: var(--text);
  margin: 0;
  padding-bottom: 1vh;
  font-size: 4vh;
}

.journey {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
}

article {
  box-sizing: border-box;
  width: 100%;
  padding: 2vh;
  border-radius: 0.8vh;
  background-color: var(--background);
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.labels {
  display: flex;
  justify-content: space-between;
  color: var(--text);
  font-size: 3vh;
  padding: 2vh 4vh;
  padding-bottom: 0;
}

.platformLabel {
  color: var(--text);
  background-color: var(--background);
  padding: 0.2vh 0.8vh;
  font-size: 3vh;
  border-radius: 99vh;
}

.platform {
  padding: 0.2vh 1vh;
  display: grid;
  place-items: center;
  background-color: var(--text);
  color: var(--background);
  border: 0.5vh solid var(--background);
  font-weight: bold;
  font-size: 4vh;
  border-radius: 1.5vh;
}
</style>

<script lang="ts" setup>
import BigDepartureBloc from "../components/BigDepartureBloc.vue";
import Clock from "../components/Clock.vue";
import Label from "../components/Label.vue";
import SideDisruptionPane from "../components/SideDisruptionPane.vue";
import { localized } from "../language";
import type { SimpleJourney } from "../services/Wagon";

const props = defineProps<{
  journey: SimpleJourney;
  journeysCount: number;
}>();

defineSlots<{
  default: {};
}>();
</script>

<template>
  <header>
    <Clock style="margin-left: 1vh; margin-top: 1vh"></Clock>
    <div class="titles">
      <h1>
        {{
          journeysCount > 1
            ? localized({
                fr: "Prochains Trains",
                en: "Next Trains",
                es: "Proximos Trenes",
              })
            : localized({
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
          <span>{{ journey.userStopDeparture.platform || "--" }}</span>
        </div>
      </div>
    </div>
  </header>
  <main>
    <div>
      <Label style="opacity: 0" severity="LOW">x</Label>
      <SideDisruptionPane :disruptions="[]"></SideDisruptionPane>
    </div>
    <div class="journey">
      <BigDepartureBloc
        :journey="journey"
        :stops-list-height="journeysCount > 1 ? '26vh' : '46vh'"
        show-labels
      ></BigDepartureBloc>
      <slot></slot>
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
  grid-template-columns: 10fr 27fr;
  column-gap: 1vh;
}

.titles {
  display: flex;
  justify-content: space-between;
  padding-right: 2vh;
}

h1 {
  margin: 0;
  font-size: 5vh;
  color: var(--background);
}

.journey {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
}

.platformLabel {
  color: var(--text);
  background-color: var(--background);
  padding: 0.2vh 1vh;
  font-size: 3vh;
  border-radius: 99vh;
}

.platform {
  padding: 0.2vh 1.2vh;
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

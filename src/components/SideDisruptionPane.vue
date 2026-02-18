<script lang="ts" setup>
import UseIDFMHorizontal from "./messages/UseIDFMHorizontal.vue";

defineProps<{
  disruptions: any[];
  side: "BOTTOM" | "LEFT";
}>();
</script>

<template>
  <div :class="{ left: side === 'LEFT', bottom: side === 'BOTTOM' }">
    <aside
      v-if="side === 'LEFT'"
      :style="{ height: side === 'LEFT' ? '66vh' : '17.2vh' }"
      class="deprecated"
    >
      <header>
        <svg
          width="142"
          height="144"
          viewBox="0 0 142 144"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13 127.5V118H28L56.5 13C56.5 13 59.5 0 70.5 0C81.5 0 84.5 13 84.5 13L113.5 118.5H128V127.5H13ZM61 27H80.5L88.5 56H53.5L61 27ZM49.5 71L41 100.5H100.5L93 71H49.5Z"
            fill="currentColor"
          />
          <rect y="137" width="142" height="7" fill="black" />
        </svg>

        <h2>Information travaux</h2>
      </header>
      <span
        >Retrouvez toutes les informations sur l’appli Ile-de-France Mobilités,
        le site Transilien.com, Ratp.fr, SNCF Connect ou votre appli de mobilité
        et sur le fil Twitter de votre ligne.</span
      >
    </aside>
    <aside v-else :style="{ height: '17.2vh' }">
      <UseIDFMHorizontal />
    </aside>
  </div>
</template>

<style scoped>
aside.deprecated {
  box-sizing: border-box;
  padding: 1.5vh;
  width: 100%;
  border-radius: 0 0.8vh 0.8vh 0;
  background-color: var(--worksite-background);
  display: flex;
  gap: 2vh;
  align-items: center;
}

.left aside.deprecated {
  flex-direction: column;
}

.bottom span {
  padding-right: 45vh;
}

.left span {
  padding-right: 4vh;
}

header {
  display: flex;
  align-items: center;
  gap: 3vh;
}

span {
  display: block;
  font-size: 4vh;
  color: var(--on-worksite-background);
}

.bottom h2 {
  display: none;
}

h2 {
  margin: 0;
  font-size: 4.5vh;
  color: var(--on-worksite-background);
}

.bottom svg {
  height: 8vh;
  width: auto;
}

.left svg {
  height: 10vh;
  width: auto;
  fill: var(--on-worksite-background);
}
</style>

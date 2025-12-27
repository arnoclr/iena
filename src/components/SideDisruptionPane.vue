<script lang="ts" setup>
defineProps<{
  disruptions: any[];
  side: "BOTTOM" | "LEFT";
}>();
</script>

<template>
  <div :class="{ left: side === 'LEFT', bottom: side === 'BOTTOM' }">
    <aside :style="{ height: side === 'LEFT' ? '66vh' : '17.2vh' }">
      <header>
        <svg
          width="207"
          height="207"
          viewBox="0 0 207 207"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M103.5 207C160.661 207 207 160.661 207 103.5C207 46.3385 160.661 0 103.5 0C46.3385 0 0 46.3385 0 103.5C0 160.661 46.3385 207 103.5 207ZM46 159.5V150H61L89.5 45C89.5 45 92.5 32 103.5 32C114.5 32 117.5 45 117.5 45L146.5 150.5H161V159.5H46ZM94 59H113.5L121.5 88H86.5L94 59ZM82.5 103L74 132.5H133.5L126 103H82.5Z"
            fill="white"
          />
        </svg>
        <h2>Information travaux</h2>
      </header>
      <span
        >Retrouvez toutes les informations sur l’appli Ile-de-France Mobilités,
        le site Transilien.com, Ratp.fr, SNCF Connect ou votre appli de mobilité
        et sur le fil Twitter de votre ligne.</span
      >
    </aside>
  </div>
</template>

<style scoped>
aside {
  box-sizing: border-box;
  padding: 1.5vh;
  width: 100%;
  border-radius: 0 0.8vh 0.8vh 0;
  background-color: var(--worksite-background);
  display: flex;
  gap: 2vh;
  align-items: center;
}

.left aside {
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
  color: var(--text);
}

.bottom h2 {
  display: none;
}

h2 {
  margin: 0;
  font-size: 4.5vh;
  color: var(--text);
}

.bottom svg {
  height: 8vh;
  width: auto;
}

.left svg {
  height: 10vh;
  width: auto;
}
</style>

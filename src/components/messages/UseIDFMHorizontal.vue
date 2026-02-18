<script lang="ts" setup></script>

<template>
  <header>
    <svg
      width="45"
      height="74"
      viewBox="0 0 45 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="1.5"
        width="42"
        height="71"
        rx="10.5"
        stroke="black"
        stroke-width="3"
      />
      <rect x="14" y="9" width="18" height="5" rx="2.5" fill="black" />
      <rect x="20" y="58" width="5" height="5" rx="2.5" fill="black" />
      <path
        d="M12 37C12 42.5228 16.4772 47 22 47C23.4599 47 24.8467 46.6872 26.097 46.1249C27.398 46.4166 30.2 47.3 31 48.5C30.8333 47.5943 30.2 45.4546 29 44.1414C30.8514 42.3265 32 39.7974 32 37C32 31.4772 27.5228 27 22 27C16.4772 27 12 31.4772 12 37Z"
        stroke="black"
        stroke-width="2"
      />
      <path
        d="M20.8305 33.0057C20.6111 32.7864 20.5014 32.5095 20.5014 32.1752C20.5014 31.8409 20.6111 31.5641 20.8305 31.3447C21.0499 31.1149 21.3372 31 21.6923 31C22.0475 31 22.3348 31.1149 22.5542 31.3447C22.784 31.5641 22.8989 31.8409 22.8989 32.1752C22.8989 32.5095 22.784 32.7864 22.5542 33.0057C22.3348 33.2147 22.0475 33.3191 21.6923 33.3191C21.3372 33.3191 21.0499 33.2147 20.8305 33.0057Z"
        fill="black"
      />
      <path
        d="M22.8049 34.3533V40.9347V42.2353H20.9402V40.4959V40.454V36.1397C20.9402 35.9621 20.9089 35.842 20.8462 35.7793C20.7939 35.7166 20.6947 35.6853 20.5484 35.6853L20 35.6539V34.3533H22.8049Z"
        fill="black"
      />
    </svg>
    <p>
      Pour plus d'informations, consultez l'application ou le site
      www.iledefrance-mobilites.fr
    </p>
  </header>
</template>

<style scoped>
header {
  display: flex;
  gap: 5vh;
  height: 100%;
  padding: 0 1.5vh;
  background-color: rgba(255, 255, 255, 0.3);
}

svg {
  height: 100%;
  width: auto;
  transform: scale(1.1);
  transform-origin: top left;
}

p {
  font-size: 4vh;
  font-weight: 500;
}
</style>

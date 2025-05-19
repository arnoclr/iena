import { defineStore } from "pinia";

export const useLangStore = defineStore("lang", {
  state: () => ({
    lang: "FR" as "FR" | "EN" | "ES",
  }),
  actions: {
    cycleLang() {
      const order = ["FR", "EN", "ES"];
      const currentIndex = order.indexOf(this.lang);
      this.lang = order[(currentIndex + 1) % order.length] as
        | "FR"
        | "EN"
        | "ES";
    },
  },
});

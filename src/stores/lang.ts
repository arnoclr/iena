import { defineStore } from "pinia";

export const useLangStore = defineStore("lang", {
  state: () => ({
    lang: "FR" as "FR" | "EN" | "ES",
    step: 0,
  }),
  actions: {
    cycleLang(this: any) {
      const sequence = ["FR", "EN", "FR", "ES"] as const;
      this.step = (this.step + 1) % sequence.length;
      this.lang = sequence[this.step];
    },
  },
});

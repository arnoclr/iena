import { useLangStore } from "./stores/lang";

export function localized({
  fr,
  en,
  es,
}: {
  fr: string;
  en: string;
  es: string;
}): string {
  const langStore = useLangStore();
  return { fr, en, es }[langStore.lang.toLowerCase()] || fr;
}

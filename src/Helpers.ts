export const Strings = {
  abbreviate: (str: string): string => {
    const map = {
      saint: "St",
      sainte: "St",
      porte: "Pte",
      // sur: "/",
    };

    // TODO: Houilles Carr. / Vernon Giv.

    let result = str;

    for (const [key, value] of Object.entries(map)) {
      const regex = new RegExp(`\\b${key}\\b`, "gi");
      result = result.replace(regex, value);
    }

    const words = result.split(/\s+/);
    if (words.length > 1 && result.length > 12) {
      result = words
        .map((word, i) => {
          if (
            i !== 0 &&
            word.length > 7 &&
            word.at(0)?.match(/[A-Z]/) &&
            !word.includes("-")
          ) {
            return word.at(0) + ".";
          }
          if (word.startsWith("St-") && word.length > 15 && words.length > 1) {
            return word.slice(0, 4) + ".";
          }
          return word;
        })
        .join(" ");
    }

    return result;
  },
};

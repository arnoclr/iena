export const Strings = {
  abbreviate: (str: string): string => {
    let result = str;

    // Remplacement des mots courants
    const map = {
      saint: "St",
      sainte: "St",
      porte: "Pte",
      "-sur-": "/",
      quartier: "Qr.",
      rue: "R.",
      avenue: "Av.",
      boulevard: "Bd.",
      place: "Pl.",
      chemin: "Ch.",
      champ: "Ch.",
      stade: "St.",
      pont: "P.",
    };

    for (const [key, value] of Object.entries(map)) {
      const regex = new RegExp(`\\b${key}\\b`, "gi");
      result = result.replace(regex, value);
    }

    // Retirer les textes entre parenthèses
    result = result.replace(/\s*\(.*?\)\s*/g, " ");

    // Garder les initiales du premier terme sur les nom avec du/de ...
    result = result.replace(
      /\b([\p{L}]{3,})([ -])(l'|le|la|les|du|de|des|en)([ -])?([\p{L}]{3,})\b/giu,
      (match, nom1, sep1, article, sep2, nom2) => {
        const nom1Clean = nom1.trim();
        const nom2Clean = nom2.trim();
        const abbreviations = Object.values(map);

        if (nom1Clean.length <= nom2Clean.length + 4) {
          if (abbreviations.includes(nom1Clean)) {
            return match;
          }
          return `${nom1Clean[0]}.${sep1}${article}${sep2 || ""}${nom2Clean}`;
        } else {
          if (abbreviations.includes(nom2Clean)) {
            return match;
          }
          return `${nom1Clean}${sep1}${article}${sep2 || ""}${nom2Clean[0]}.`;
        }
      }
    );

    return result;
  },
};

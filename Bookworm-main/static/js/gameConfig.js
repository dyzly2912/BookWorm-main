const GameConfig = {
    letters: [...("ABCDEFGHIJKLMNOPRSTVWXYZ".split("")), "Qu", "U"],
    tiers: {
        bronze: "ADEGILNORSTU".split(""),
        silver: "BCFHMPVWY".split(""),
        gold: ["J", "K", "Qu", "X", "Z"]
    },
    maxHP: 10.0,
    apiEndpoint: "https://api.dictionaryapi.dev/api/v2/entries/en/"
};

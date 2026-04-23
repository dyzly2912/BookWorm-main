class DictionaryService {
    static async isValidWord(word) {
        if (word.length < 3) return false;
        try {
            const response = await fetch(`${GameConfig.apiEndpoint}${word.toLowerCase()}`);
            return response.ok;
        } catch (e) {
            console.log("API Error", e);
            return false;
        }
    }
}

class DamageCalculator {
    static calculate(selectedTiles) {
        let baseDamage = (selectedTiles.length * 0.25);
        let multiplier = 1.0;

        selectedTiles.forEach(tile => {
            if (tile.tier === 'gold') multiplier += 0.20;
            else if (tile.tier === 'silver') multiplier += 0.10;
        });

        return Math.ceil((baseDamage * multiplier) * 4) / 4;
    }
}

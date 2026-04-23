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

class SoundService {
    static audioCtx = null;

    static init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    static playShootSound() {
        this.init();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.2);
    }

    static playHitSound() {
        this.init();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        // Use sawtooth for a harsher hit sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.audioCtx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.3);
    }
}

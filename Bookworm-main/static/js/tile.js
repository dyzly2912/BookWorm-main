class Tile {
    constructor(letter, onToggleCallback) {
        this.letter = letter;
        this.onToggleCallback = onToggleCallback;
        this.element = null;
        this.isSelected = false;
        this.tier = this.getTier(letter);
    }

    getTier(letter) {
        if (GameConfig.tiers.gold.includes(letter)) return 'gold';
        if (GameConfig.tiers.silver.includes(letter)) return 'silver';
        return 'bronze';
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'tile';
        this.element.textContent = this.letter;

        this.dot = document.createElement('div');
        this.dot.className = `tile-dot dot-${this.tier}`;
        this.element.appendChild(this.dot);

        this.element.onclick = () => this.toggle();
        return this.element;
    }

    toggle() {
        this.onToggleCallback(this);
    }

    select() {
        this.isSelected = true;
        this.element.classList.add('selected');
    }

    deselect() {
        this.isSelected = false;
        this.element.classList.remove('selected');
    }

    setLetter(newLetter) {
        this.letter = newLetter;
        this.tier = this.getTier(newLetter);
        this.element.textContent = newLetter;
        this.element.appendChild(this.dot); // Re-append dot since textContent clears it
        this.dot.className = `tile-dot dot-${this.tier}`;
    }
}

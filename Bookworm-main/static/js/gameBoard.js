class GameBoard {
    constructor(onSelectionChange) {
        this.columns = [
            document.getElementById('col-0'),
            document.getElementById('col-1'),
            document.getElementById('col-2'),
            document.getElementById('col-3')
        ];
        this.selectedTiles = [];
        this.onSelectionChange = onSelectionChange;
        this.allTiles = [];
    }

    getRandomLetter() {
        return GameConfig.letters[Math.floor(Math.random() * GameConfig.letters.length)];
    }

    handleTileToggle(tile) {
        const index = this.selectedTiles.indexOf(tile);
        if (index !== -1) {
            if (index === this.selectedTiles.length - 1) { // Only undo last
                tile.deselect();
                this.selectedTiles.pop();
                this.onSelectionChange(this.selectedTiles);
            }
        } else {
            tile.select();
            this.spawnFlyingLetter(tile);
            this.selectedTiles.push(tile);
            this.onSelectionChange(this.selectedTiles);
        }
    }

    spawnFlyingLetter(tile) {
        const rect = tile.element.getBoundingClientRect();
        const wordBarRect = document.getElementById('word-bar').getBoundingClientRect();

        const flying = document.createElement('div');
        flying.className = 'tile flying-tile';
        flying.textContent = tile.letter;
        
        const dot = document.createElement('div');
        dot.className = `tile-dot dot-${tile.tier}`;
        flying.appendChild(dot);

        flying.style.left = rect.left + 'px';
        flying.style.top = rect.top + 'px';
        
        document.body.appendChild(flying);

        // Force reflow
        flying.getBoundingClientRect();

        flying.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        flying.style.left = (wordBarRect.left + wordBarRect.width / 2 - 32.5) + 'px';
        flying.style.top = (wordBarRect.top + wordBarRect.height / 2 - 32.5) + 'px';
        flying.style.transform = 'scale(0.5)';
        flying.style.opacity = '0';

        setTimeout(() => flying.remove(), 400);
    }

    init() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.addRandomTileToCol(i);
            }
        }
    }

    addRandomTileToCol(colIndex) {
        const letter = this.getRandomLetter();
        const tile = new Tile(letter, (t) => this.handleTileToggle(t));
        this.columns[colIndex].appendChild(tile.render());
        this.allTiles.push(tile);
        return tile;
    }

    clearSelection() {
        this.selectedTiles.forEach(t => t.deselect());
        this.selectedTiles = [];
        this.onSelectionChange(this.selectedTiles);
    }

    removeSelectedTiles() {
        this.selectedTiles.forEach(tile => {
            tile.element.remove();
            this.allTiles = this.allTiles.filter(t => t !== tile);
        });
        this.selectedTiles = [];
        this.onSelectionChange(this.selectedTiles);
    }

    refill() {
        for (let i = 0; i < 4; i++) {
            const col = this.columns[i];
            const tilesNeeded = 4 - col.querySelectorAll('.tile').length;
            for (let t = 0; t < tilesNeeded; t++) {
                setTimeout(() => { this.addRandomTileToCol(i); }, t * 100);
            }
        }
    }

    randomize() {
        this.clearSelection();
        this.allTiles.forEach((tile) => {
            let cycles = 0;
            const maxCycles = 10 + Math.floor(Math.random() * 8);
            const interval = setInterval(() => {
                tile.element.textContent = this.getRandomLetter();

                if (tile.dot) tile.dot.remove();
                tile.dot = document.createElement('div');
                tile.dot.className = 'tile-dot dot-bronze';
                tile.element.appendChild(tile.dot);

                cycles++;
                if (cycles >= maxCycles) {
                    clearInterval(interval);
                    const finalLetter = this.getRandomLetter();
                    tile.setLetter(finalLetter);
                }
            }, 60);
        });
    }
}

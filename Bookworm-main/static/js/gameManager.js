class GameManager {
    constructor() {
        this.player = new Entity(GameConfig.maxHP, 'player-sprite', 'player-health');
        this.enemy = new Entity(GameConfig.maxHP, 'enemy-sprite', 'enemy-health');
        this.board = new GameBoard((tiles) => this.onSelectionChange(tiles));

        this.wordBar = document.getElementById('word-bar');
        this.attackBtn = document.getElementById('attack-btn');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.isGameOver = false;

        this.bindEvents();
    }

    bindEvents() {
        this.attackBtn.onclick = () => {
            if (!this.isGameOver) this.processAttack();
        };
        this.shuffleBtn.onclick = () => {
            if (!this.isGameOver) this.board.randomize();
        };
    }

    init() {
        this.player.updateHearts();
        this.enemy.updateHearts();
        this.board.init();
    }

    async onSelectionChange(selectedTiles) {
        if (this.isGameOver) return;
        
        const currentWord = selectedTiles.map(t => t.letter).join("");
        this.wordBar.textContent = currentWord || "SELECT LETTERS";
        this.wordBar.style.color = "#f1c40f"; // Accent color

        this.setAttackReady(false);
        if (currentWord.length >= 3) {
            const isValid = await DictionaryService.isValidWord(currentWord);
            // Ensure selection hasn't changed while waiting
            const newWord = this.board.selectedTiles.map(t => t.letter).join("");
            if (newWord === currentWord) {
                this.setAttackReady(isValid);
            }
        }
    }

    setAttackReady(isReady) {
        if (isReady && !this.isGameOver) {
            this.attackBtn.classList.add('ready');
            this.attackBtn.disabled = false;
        } else {
            this.attackBtn.classList.remove('ready');
            this.attackBtn.disabled = true;
        }
    }

    processAttack() {
        if (this.isGameOver) return;
        const tiles = this.board.selectedTiles;
        if (tiles.length === 0) return;

        const currentWord = tiles.map(t => t.letter).join("");
        const damage = DamageCalculator.calculate(tiles);
        
        this.setAttackReady(false);
        this.wordBar.textContent = "";

        const projectile = document.createElement('div');
        projectile.className = 'attack-projectile';
        projectile.textContent = currentWord;
        
        const wordBarRect = this.wordBar.getBoundingClientRect();
        const enemyRect = this.enemy.spriteEl.getBoundingClientRect();
        
        projectile.style.left = wordBarRect.left + (wordBarRect.width / 2) + 'px';
        projectile.style.top = wordBarRect.top + (wordBarRect.height / 2) + 'px';
        document.body.appendChild(projectile);

        SoundService.playShootSound();
        this.player.playAnimation('player-attacking', 400);

        setTimeout(() => {
            projectile.style.left = enemyRect.left + (enemyRect.width / 2) + 'px';
            projectile.style.top = enemyRect.top + (enemyRect.height / 2) + 'px';
            projectile.style.transform = 'translate(-50%, -50%) scale(1.5) rotate(15deg)';
            projectile.style.color = '#e74c3c';
            projectile.style.textShadow = '0 0 20px #e74c3c';
        }, 150);

        setTimeout(() => {
            projectile.remove();
            this.enemy.takeDamage(damage);
            SoundService.playHitSound();
            this.enemy.playAnimation('enemy-hit', 300);

            this.wordBar.textContent = `HIT! -${damage.toFixed(2)}`;
            this.wordBar.style.color = "#e74c3c";

            this.board.removeSelectedTiles();

            if (!this.checkGameOver()) {
                setTimeout(() => this.enemyTurn(), 1000);
            }
        }, 450);
    }

    enemyTurn() {
        if (this.isGameOver) return;
        
        this.wordBar.textContent = "ENEMY ATTACKING...";
        this.wordBar.style.color = "#e74c3c";
        
        setTimeout(() => {
            const damage = 1.0 + Math.random() * 1.5; // Random damage 1.0 to 2.5
            
            const projectile = document.createElement('div');
            projectile.className = 'attack-projectile';
            projectile.textContent = "⚔️";
            
            const enemyRect = this.enemy.spriteEl.getBoundingClientRect();
            const playerRect = this.player.spriteEl.getBoundingClientRect();
            
            projectile.style.left = enemyRect.left + (enemyRect.width / 2) + 'px';
            projectile.style.top = enemyRect.top + (enemyRect.height / 2) + 'px';
            projectile.style.color = '#fff';
            projectile.style.textShadow = '0 0 20px #fff';
            document.body.appendChild(projectile);
            
            SoundService.playShootSound();
            this.enemy.playAnimation('enemy-attacking', 400);
            
            setTimeout(() => {
                projectile.style.left = playerRect.left + (playerRect.width / 2) + 'px';
                projectile.style.top = playerRect.top + (playerRect.height / 2) + 'px';
                projectile.style.transform = 'translate(-50%, -50%) scale(2) rotate(-15deg)';
            }, 150);
            
            setTimeout(() => {
                projectile.remove();
                this.player.takeDamage(damage);
                SoundService.playHitSound();
                this.player.playAnimation('player-hit', 300);
                
                this.wordBar.textContent = `OUCH! -${damage.toFixed(2)}`;
                
                if (!this.checkGameOver()) {
                    setTimeout(() => {
                        this.wordBar.textContent = "SELECT LETTERS";
                        this.wordBar.style.color = "#f1c40f";
                        this.board.refill();
                    }, 600);
                }
            }, 450);
        }, 1000);
    }

    checkGameOver() {
        if (this.enemy.hp <= 0) {
            this.endGame(true);
            return true;
        } else if (this.player.hp <= 0) {
            this.endGame(false);
            return true;
        }
        return false;
    }

    endGame(playerWon) {
        this.isGameOver = true;
        this.setAttackReady(false);
        this.wordBar.textContent = playerWon ? "VICTORY!" : "DEFEAT!";
        
        setTimeout(() => {
            const modal = document.getElementById("game-over-modal");
            const title = document.getElementById("game-over-title");
            const msg = document.getElementById("game-over-msg");
            
            if (playerWon) {
                title.textContent = "YOU WIN!";
                title.style.color = "#f1c40f";
                msg.textContent = "You have defeated the enemy.";
            } else {
                title.textContent = "YOU LOSE!";
                title.style.color = "#e74c3c";
                title.style.textShadow = "0 0 15px rgba(231, 76, 60, 0.5)";
                msg.textContent = "The enemy has defeated you.";
            }
            
            modal.classList.add("visible");
        }, 1000);
    }
}

// --- 7. BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameManager();
    game.init();
});

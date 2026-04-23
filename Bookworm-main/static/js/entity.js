class Entity {
    constructor(maxHP, spriteId, healthBarId) {
        this.hp = maxHP;
        this.maxHP = maxHP;
        this.spriteEl = document.getElementById(spriteId);
        this.healthBarEl = document.getElementById(healthBarId);
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        this.updateHearts();
    }

    updateHearts() {
        this.healthBarEl.innerHTML = '';
        for (let i = 1; i <= this.maxHP; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';

            if (this.hp >= i) { heart.classList.add('p100'); }
            else if (this.hp >= i - 0.25) { heart.classList.add('p75'); }
            else if (this.hp >= i - 0.5) { heart.classList.add('p50'); }
            else if (this.hp >= i - 0.75) { heart.classList.add('p25'); }
            else { heart.classList.add('p00'); }

            this.healthBarEl.appendChild(heart);
        }
    }

    playAnimation(animClass, duration) {
        this.spriteEl.classList.add(animClass);
        setTimeout(() => this.spriteEl.classList.remove(animClass), duration);
    }
}

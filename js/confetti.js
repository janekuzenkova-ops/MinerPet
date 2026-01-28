// MinerPet - Confetti Animation

const Confetti = {
    colors: ['#FFB800', '#4ADE80', '#EF4444', '#3B82F6', '#FACC15', '#EC4899'],
    
    launch(count = 50) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.createPiece(), i * 30);
        }
    },

    createPiece() {
        const piece = document.createElement('div');
        piece.className = 'confetti';
        
        // Random position
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.top = '-20px';
        
        // Random color
        piece.style.background = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        // Random size
        const size = Math.random() * 8 + 6;
        piece.style.width = size + 'px';
        piece.style.height = size + 'px';
        
        // Random shape
        if (Math.random() > 0.5) {
            piece.style.borderRadius = '50%';
        } else {
            piece.style.borderRadius = '2px';
        }
        
        // Random animation duration
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        document.body.appendChild(piece);
        
        // Remove after animation
        setTimeout(() => piece.remove(), 4000);
    }
};

window.Confetti = Confetti;

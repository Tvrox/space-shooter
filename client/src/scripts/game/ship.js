export class Ship {
    constructor(x = 300, y = 300) {
        this.x = x;
        this.y = y;
    }

    reset() {
        this.x = 300;
        this.y = 300;
    }

    moveWithMouse(canvas, getUseMouse, setUseMouse) {
        const handleMouseMove = (event) => {
            if (!getUseMouse() && this.awaitingMouseSync) {
                const rect = canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
                this.x = mouseX * canvas.width / rect.width - 25;
                this.y = mouseY * canvas.height / rect.height - 13;
                this.clamp(canvas);
                setUseMouse(true);
                this.awaitingMouseSync = false;
            }

            if (!getUseMouse()) return;

            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            this.x = mouseX * canvas.width / rect.width - 25;
            this.y = mouseY * canvas.height / rect.height - 13;
            this.clamp(canvas);
        };

        this.awaitingMouseSync = false;
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mousedown', () => {
            if (!getUseMouse()) this.awaitingMouseSync = true;
        });
    }

    moveWithKeyboard(keys, canvas) {
        const speed = 4;
        if (keys.w || keys.ArrowUp) this.y -= speed;
        if (keys.s || keys.ArrowDown) this.y += speed;
        if (keys.a || keys.ArrowLeft) this.x -= speed;
        if (keys.d || keys.ArrowRight) this.x += speed;
        this.clamp(canvas);
    }

    clamp(canvas) {
        this.x = Math.max(0, Math.min(canvas.width - 50, this.x));
        this.y = Math.max(0, Math.min(canvas.height - 50, this.y));
    }
}
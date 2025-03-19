import { Router } from '../router';
import { Option, RouterState } from '../types';

export class Picker {
  private router: Router;
  private options: Option[];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private colors: string[];
  private angleOffsets: number[];
  private isSpinning: boolean;
  private currentRotation: number = 0;
  private isSoundOn: boolean;
  private finishSound: HTMLAudioElement;


  constructor(router: Router, state: RouterState) {
    this.router = router;
    this.options = this.shuffleArray(state.options || []);

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.colors = this.options.map(() => this.getRandomColor());
    this.angleOffsets = this.calculateAngleOffsets();
    this.isSpinning = false;
    this.currentRotation = 0;

    this.isSoundOn = localStorage.getItem('soundState') !== 'off';
    this.finishSound = new Audio('/finish-sound.mp3');
  }

  public render(): HTMLElement {
    const container = document.createElement('div');
    container.className = "picker-container";
    
    const title = document.createElement('h1');
    title.textContent = 'Decision Making Tool';

    const controlsContainer = document.createElement('div');
    controlsContainer.className = "controls-container";

    const backButton = document.createElement('button');
    backButton.className = "control-button";
    backButton.textContent = "←";
    backButton.addEventListener('click', () => this.router.navigateTo('list'));

    const durationContainer = document.createElement('div');
    durationContainer.className = 'duration-container';

    const durationIcon = document.createElement('span');
    durationIcon.textContent = "⏲";
    durationIcon.className = 'duration-button';

    const durationInput = document.createElement('input');
    durationInput.className = 'duration-input';
    durationInput.type = "number";
    durationInput.placeholder = "Duration (seconds)";
    durationInput.value = "16";
    durationInput.min = "5";
    durationInput.max = "30";
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Enter a value > 4';
    tooltip.style.display = 'none';
    durationInput.addEventListener('input', () => {
    const value = parseInt(durationInput.value, 10);
      if (value < 5) {
        tooltip.style.display = 'block';
      } else {
        tooltip.style.display = 'none';
      }
    });

    durationIcon.addEventListener('click', () => durationInput.focus());
    durationContainer.append(durationIcon, durationInput, tooltip);

    const spinButton = document.createElement('button');
    spinButton.className = "control-button";
    spinButton.textContent = '▶';
    spinButton.addEventListener('click', () => {
        const duration = parseInt(durationInput.value, 10);
        if (duration >= 5) {
          this.spinWheel(resultField, durationInput, duration * 1000, [backButton, spinButton, soundButton]);
        } else {
          return;
        }
    });
    const soundButton = document.createElement('button');
    soundButton.className = "control-button";
    soundButton.textContent = "🔊";
    soundButton.textContent = this.isSoundOn ? "🔊" : "🔇";
    soundButton.addEventListener('click', () => {
      this.toggleSound(soundButton);
    });
    controlsContainer.append(backButton, durationContainer, soundButton, spinButton);

    const resultField = document.createElement('div');
    resultField.className = "result-field";
    resultField.textContent = "Press start button";

    const canvasContainer = document.createElement("div");
    canvasContainer.className = "canvas-container";

    this.canvas.width = 410;
    this.canvas.height = 410;
    canvasContainer.appendChild(this.canvas);

    this.drawWheel();

    container.append(title, controlsContainer, resultField, canvasContainer);
    return container;
  }
  private toggleSound(soundButton: HTMLButtonElement) {
    this.isSoundOn = !this.isSoundOn;
    soundButton.textContent = this.isSoundOn ? "🔊" : "🔇";
    localStorage.setItem('soundState', this.isSoundOn ? 'on' : 'off');
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  private getRandomColor(): string {
    return `hsl(${Math.random() * 360}, 70%, 60%)`;
  }

  private calculateAngleOffsets(): number[] {
    const totalWeight = this.options.reduce((sum, option) => sum + (option.weight || 1), 0);
    let currentAngle = 0;

    return this.options.map((option) => {
      const angle = ((option.weight || 1) / totalWeight) * (Math.PI * 2);
      const offset = currentAngle;
      currentAngle += angle;
      return offset;
    });
  }

  private drawWheel() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const radius = (this.canvas.width - 10) / 2;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.currentRotation);
    ctx.translate(-centerX, -centerY);

    this.options.forEach((option, index) => {
      const startAngle = this.angleOffsets[index];
      const endAngle = this.angleOffsets[index + 1] || Math.PI * 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = this.colors[index];
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      this.drawText(ctx, option.title, centerX, centerY, startAngle, endAngle, radius);
    });

    ctx.restore();
    this.drawCursor();
    this.drawCenterElement(ctx, centerX, centerY);
  }

  private drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number,
    startAngle: number,
    endAngle: number,
    radius: number
  ) {
    const midAngle = (startAngle + endAngle) / 2;
    const textRadius = radius * 0.7;

    const angleRange = endAngle - startAngle;
    const minAngleForText = Math.PI / 8;

    if (angleRange < minAngleForText) {
      return;
    }
    const maxTextLength = 10;
    if (text.length > maxTextLength) {
      text = text.slice(0, maxTextLength) + "...";
    }

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(midAngle);

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.strokeText(text, textRadius, 0);
    ctx.fillText(text, textRadius, 0);

    ctx.restore();
  }

  private drawCursor() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const radius = (this.canvas.width - 10) / 2
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius + 25);
    ctx.lineTo(centerX - 15, centerY - radius - 10);
    ctx.lineTo(centerX + 15, centerY - radius - 10);
    ctx.closePath();
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  private drawCenterElement(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = "#98d399";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  private spinWheel(resultField: HTMLDivElement, durationInput: HTMLInputElement, duration: number, buttons: HTMLButtonElement[] ) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    buttons.forEach(button => {
      button.disabled = true;
      button.style.opacity = "0.5";
    });
    durationInput.disabled = true;
    durationInput.style.opacity = "0.5";

    const startTime = Date.now();
    const startRotation = this.currentRotation;
    const randomRotation = Math.random() * 10 + 5;

    const animate = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const easedProgress = this.easeInOutCubic(progress);

      this.currentRotation = startRotation + (randomRotation * Math.PI * 2 * easedProgress);
      this.drawWheel();

      this.updateResultField(resultField, this.currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.updateResultField(resultField, this.currentRotation, true);
        buttons.forEach(button => {
          button.disabled = false;
          button.style.opacity = "1";
        });
        durationInput.disabled = false;
        durationInput.style.opacity = "1";
        if (this.isSoundOn) {
          this.finishSound.play();
        }
      }
    };

    animate();
  }
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  private updateResultField(resultField: HTMLDivElement, currentRotation: number, isFinal: boolean = false) {
    const totalRotation = (currentRotation % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const pointerAngle = (3 * Math.PI / 2 - totalRotation + Math.PI * 2) % (Math.PI * 2);

    const selectedIndex = this.angleOffsets.findIndex((offset, index) => {
      const nextOffset = this.angleOffsets[index + 1] || Math.PI * 2;
      return pointerAngle >= offset && pointerAngle < nextOffset;
    });

    if (selectedIndex !== -1) {
      resultField.textContent = this.options[selectedIndex].title;
      resultField.style.border = isFinal ? "2px solid #327333" : "2px solid #ccc";
    }
  }
}
import type { Router } from '../router';
import type { Option, RouterState } from '../types';

export class Picker {
  private static readonly CANVAS_SIZE = 410;
  private static readonly MIN_DURATION = 5;
  private static readonly MAX_TEXT_LENGTH = 10;

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

  private readonly wheelStyles = {
    strokeStyle: "#333",
    lineWidth: 2,
  };

  private readonly centerElementStyles = {
    fillStyle: "#98d399",
    strokeStyle: "#fff",
    lineWidth: 3,
    radius: 30,
  };

  private readonly cursorStyles = {
    fillStyle: "#000",
    strokeStyle: "#000",
    lineWidth: 2,
    tipOffset: 25,
    baseOffset: 10,
    width: 15,
  };

  private readonly textStyles = {
    fillStyle: "white",
    font: "16px Arial",
    textAlign: "center" as const,
    textBaseline: "middle" as const,
    strokeStyle: "black",
    lineWidth: 2,
  };

  constructor(router: Router, state: RouterState) {
    this.router = router;
    this.options = Picker.shuffleArray(state.options || []);

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.colors = this.options.map(() => Picker.getRandomColor());
    this.angleOffsets = this.calculateAngleOffsets();
    this.isSpinning = false;
    this.currentRotation = 0;

    this.isSoundOn = localStorage.getItem('soundState') !== 'off';
    this.finishSound = new Audio('/finish-sound.mp3');
  }

  private static shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  private static getRandomColor(): string {
    return `hsl(${Math.random() * 360}, 70%, 60%)`;
  }

  private static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
      if (value < Picker.MIN_DURATION) {
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
        if (duration >= Picker.MIN_DURATION) {
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

    this.canvas.width = Picker.CANVAS_SIZE;
    this.canvas.height = Picker.CANVAS_SIZE;
    canvasContainer.appendChild(this.canvas);

    this.drawWheel();

    container.append(title, controlsContainer, resultField, canvasContainer);
    return container;
  }
  private toggleSound(soundButton: HTMLButtonElement):void {
    this.isSoundOn = !this.isSoundOn;
    soundButton.textContent = this.isSoundOn ? "🔊" : "🔇";
    localStorage.setItem('soundState', this.isSoundOn ? 'on' : 'off');
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

  private drawWheel():void {
    if (!this.ctx) return;
    const context = this.ctx;
    const radius = (this.canvas.width - 10) / 2;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.save();
    context.translate(centerX, centerY);
    context.rotate(this.currentRotation);
    context.translate(-centerX, -centerY);

    this.options.forEach((option, index) => {
      const startAngle = this.angleOffsets[index];
      const endAngle = this.angleOffsets[index + 1] || Math.PI * 2;

      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(centerX, centerY, radius, startAngle, endAngle);
      context.fillStyle = this.colors[index];
      context.fill();
      context.strokeStyle = this.wheelStyles.strokeStyle;
      context.lineWidth = this.wheelStyles.lineWidth;
      context.stroke();

      this.drawText(context, option.title, centerX, centerY, startAngle, endAngle, radius);
    });

    context.restore();
    this.drawCursor();
    this.drawCenterElement(context, centerX, centerY);
  }

  private drawText(
    context: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number,
    startAngle: number,
    endAngle: number,
    radius: number
  ):void {
    const midAngle = (startAngle + endAngle) / 2;
    const textRadius = radius * 0.7;

    const angleRange = endAngle - startAngle;
    const minAngleForText = Math.PI / 8;

    if (angleRange < minAngleForText) {
      return;
    }

    if (text.length > Picker.MAX_TEXT_LENGTH) {
      text = text.slice(0, Picker.MAX_TEXT_LENGTH) + "...";
    }

    context.save();
    context.translate(centerX, centerY);
    context.rotate(midAngle);

    context.fillStyle = this.textStyles.fillStyle;
    context.font = this.textStyles.font;
    context.textAlign = this.textStyles.textAlign;
    context.textBaseline = this.textStyles.textBaseline;
    context.strokeStyle = this.textStyles.strokeStyle;
    context.lineWidth = this.textStyles.lineWidth;

    context.strokeText(text, textRadius, 0);
    context.fillText(text, textRadius, 0);

    context.restore();
  }

  private drawCursor():void {
    if (!this.ctx) return;
    const context = this.ctx;
    const radius = (this.canvas.width - 10) / 2;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    context.beginPath();
    context.moveTo(centerX, centerY - radius + this.cursorStyles.tipOffset);
    context.lineTo(centerX - this.cursorStyles.width, centerY - radius - this.cursorStyles.baseOffset);
    context.lineTo(centerX + this.cursorStyles.width, centerY - radius - this.cursorStyles.baseOffset);
    context.closePath();
    context.fillStyle = this.cursorStyles.fillStyle;
    context.fill();
    context.strokeStyle = this.cursorStyles.strokeStyle;
    context.lineWidth = this.cursorStyles.lineWidth;
    context.stroke();
  }

  private drawCenterElement(context: CanvasRenderingContext2D, centerX: number, centerY: number):void {
    context.beginPath();
    context.arc(centerX, centerY, this.centerElementStyles.radius, 0, Math.PI * 2);
    context.fillStyle = this.centerElementStyles.fillStyle;
    context.fill();
    context.strokeStyle = this.centerElementStyles.strokeStyle;
    context.lineWidth = this.centerElementStyles.lineWidth;
    context.stroke();
  }
  private spinWheel(resultField: HTMLDivElement, durationInput: HTMLInputElement, duration: number, buttons: HTMLButtonElement[] ): void {
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

    const animate = (): void => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const easedProgress = Picker.easeInOutCubic(progress);

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

  private updateResultField(resultField: HTMLDivElement, currentRotation: number, isFinal: boolean = false): void {
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
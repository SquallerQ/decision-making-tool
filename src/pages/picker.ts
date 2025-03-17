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


  constructor(router: Router, state: RouterState) {
    this.router = router;
    this.options = this.shuffleArray(state.options || []);

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.colors = this.options.map(() => this.getRandomColor());
    this.angleOffsets = this.calculateAngleOffsets();
    this.isSpinning = false;
    this.currentRotation = 0;
  }

  public render(): HTMLElement {
    const container = document.createElement('div');
    container.className = "picker-container";
    
    const title = document.createElement('h1');
    title.textContent = 'Decision Making Tool';

    const backButton = document.createElement('button');
    backButton.textContent = 'Go to List Page';
    backButton.addEventListener('click', () => this.router.navigateTo('list'));

    const resultField = document.createElement('div');
    resultField.className = "result-field";
    resultField.textContent = "Press start button";

    const spinButton = document.createElement('button');
    spinButton.textContent = 'Spin the Wheel';
    spinButton.addEventListener('click', () => this.spinWheel(resultField));

    const canvasContainer = document.createElement("div");
    canvasContainer.className = "canvas-container";

    this.canvas.width = 410;
    this.canvas.height = 410;
    canvasContainer.appendChild(this.canvas);

    this.drawWheel();

    container.append(title, resultField, canvasContainer, backButton, spinButton);
    return container;
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

    if (text.length > 20) {
      text = text.slice(0, 10) + "...";
    }

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(midAngle);

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
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
  private spinWheel(resultField: HTMLDivElement) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const spinDuration = 3000;
    const startTime = Date.now();
    const startRotation = this.currentRotation;
    const randomRotation = Math.random() * 10 + 5;

    const animate = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / spinDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); 

      this.currentRotation = startRotation + (randomRotation * Math.PI * 2 * easeOut);
      this.drawWheel();

      this.updateResultField(resultField, this.currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.updateResultField(resultField, this.currentRotation, true);
      }
    };

    animate();
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
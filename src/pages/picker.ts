import { Router } from '../router';
import { Option, RouterState } from '../types';

export class Picker {
  private router: Router;
  private options: Option[];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;


  constructor(router: Router, state: RouterState) {
    this.router = router;
    this.options = state.options || [];

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  public render(): HTMLElement {
    const container = document.createElement('div');
    container.className = "picker-container";
    
    const title = document.createElement('h1');
    title.textContent = 'Decision Making Tool';

    const backButton = document.createElement('button');
    backButton.textContent = 'Go to List Page';
    backButton.addEventListener('click', () => this.router.navigateTo('list'));

    const canvasContainer = document.createElement("div");
    canvasContainer.className = "canvas-container";

    this.canvas.width = 400;
    this.canvas.height = 400;
    canvasContainer.appendChild(this.canvas);

    this.drawWheel();

    container.append(title, canvasContainer, backButton);
    return container;
  }

  private drawWheel() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const radius = this.canvas.width / 2;
    const centerX = radius;
    const centerY = radius;
    const startAngle = 0;
    const endAngle = Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.fillStyle = '#ccc';
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}
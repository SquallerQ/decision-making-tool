import { Router } from '../router';

export class Picker {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  public render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'page';
    console.log(container);
    

    const title = document.createElement('h1');
    title.textContent = 'Picker Page';

    const button = document.createElement('button');
    button.textContent = 'Go to List Page';
    button.addEventListener('click', () => this.router.navigateTo('list'));

    container.appendChild(title);
    container.appendChild(button);

    return container;
  }
}
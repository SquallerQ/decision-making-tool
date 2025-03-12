import { Router } from '../router';

export class List {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  public render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'page';

    const title = document.createElement('h1');
    title.textContent = 'List Page';

    const button = document.createElement('button');
    button.textContent = 'Go to Picker Page';
    button.addEventListener('click', () => this.router.navigateTo('picker'));

    container.appendChild(title);
    container.appendChild(button);

    return container;
  }
}


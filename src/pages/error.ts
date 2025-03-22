import type { Router } from '../router';
import type { RouterState } from '../types';

export class Error {
  private router: Router;
  private state: RouterState;

  constructor(router: Router, state: RouterState) {
    this.router = router;
    this.state = state;
  }

  public render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'error-container';

    const title = document.createElement('h1');
    title.textContent = 'Something went wrong';

    const backButton = document.createElement('button');
    backButton.textContent = 'Back to List';
    backButton.className = 'btn';
    backButton.addEventListener('click', () => {
      this.router.navigateTo('list');
    });

    container.append(title, backButton);
    return container;
  }
}
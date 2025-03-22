import { List } from './pages/list';
import { Picker } from './pages/picker';
import { Error } from './pages/error';
import type { RouterState } from './types';
import { getOptions } from './utils/storage';

export class Router {
  private root: HTMLElement;
  private state: RouterState = { options: getOptions() };

  constructor(root: HTMLElement) {
    this.root = root;
    this.setupRoutes();
    this.renderPage();
  }

  public navigateTo(page: string, data?: RouterState): void {
    this.state = { ...this.state, ...(data || {}) };

    if (page === 'picker') {
      const options = getOptions();
      if (!options || options.length < 2) {
        window.location.hash = 'error';
        this.renderPage();
        return;
      }
    }

    window.location.hash = page;
    this.renderPage();
  }

  private setupRoutes(): void {
    window.addEventListener('hashchange', () => this.renderPage());
  }

  private renderPage():void {
    this.clearRoot();
    const route = window.location.hash.replace('#', '') || 'list';
    const options = getOptions();

    let page;
    if (route === 'list') {
      page = new List(this, this.state);
    } else if (route === 'picker' && options && options.length >= 2) {
      page = new Picker(this, this.state);
    } else {
      page = new Error(this, this.state);
    }

    this.root.appendChild(page.render());
  }

  private clearRoot():void {
    this.root.replaceChildren();
  }
}
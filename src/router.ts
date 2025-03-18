import { List } from './pages/list';
import { Picker } from './pages/picker';
import { Error } from './pages/error';
import { Option, RouterState } from './types';
import { getOptions } from './utils/storage';

export class Router {
  private root: HTMLElement;
  private state: RouterState = { options: getOptions() };

  constructor(root: HTMLElement) {
    this.root = root;
    this.setupRoutes();
    this.renderPage();
  }

  private setupRoutes() {
    window.addEventListener('hashchange', () => this.renderPage());
  }

  public navigateTo(page: string, data?: RouterState) {
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

  private renderPage() {
    this.clearRoot();
    const route = window.location.hash.replace('#', '') || 'list';

    if (route === 'list') {
      this.root.appendChild(new List(this, this.state).render());
    } else if (route === 'picker') {
      const options = getOptions();
      if (!options || options.length < 2) {
        this.root.appendChild(new Error(this, this.state).render());
      } else {
        this.root.appendChild(new Picker(this, this.state).render());
      }
    } else {
      this.root.appendChild(new Error(this, this.state).render());
    }
  }

  private clearRoot() {
    this.root.replaceChildren();
  }
}
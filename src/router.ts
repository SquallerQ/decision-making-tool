import { List } from './pages/list';
import { Picker } from './pages/picker';
import { Option, RouterState } from './types';

export class Router {
  private root: HTMLElement;
  private state: RouterState = {};

  constructor (root: HTMLElement) {
    this.root = root;
    this.setupRoutes()
    this.navigateTo('list')
  }

  private setupRoutes() {
    window.addEventListener('popstate', () => this.renderPage());
  }

  public navigateTo (page: string, data?: RouterState) {
    this.state = data || {};
    history.pushState({}, '', `/${page}`);
    this.renderPage();
  }

  private renderPage() {
    const path = window.location.pathname;
     this.clearRoot();

    if (path === '/list') {
      this.root.appendChild(new List(this, this.state).render());
    } else if (path === '/picker') {
      this.root.appendChild(new Picker(this, this.state).render());
    }
  }
  
  private clearRoot() {
    this.root.replaceChildren();
  }
}



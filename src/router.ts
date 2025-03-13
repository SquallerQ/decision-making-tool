import { List } from './pages/list';
import { Picker } from './pages/picker';

export class Router {
  private root: HTMLElement;

  constructor (root: HTMLElement) {
    this.root = root;
    this.setupRoutes()
    this.navigateTo('list')
  }

  private setupRoutes() {
    window.addEventListener('popstate', () => this.renderPage());
  }

  public navigateTo (page: string) {
    history.pushState({}, '', `/${page}`);
    this.renderPage();
  }

  private renderPage() {
    const path = window.location.pathname;
     this.clearRoot();

    if (path === '/list') {
      this.root.appendChild(new List(this).render());
    } else if (path === '/picker') {
      this.root.appendChild(new Picker(this).render());
    }
  }
  
  private clearRoot() {
    this.root.replaceChildren();
  }
}



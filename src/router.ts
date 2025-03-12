import { List } from './pages/list';
import { Picker } from './pages/picker';

export class Router {
  constructor () {
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
    this.clearBody();

    if (path === '/list') {
      const list = new List(this);
      document.body.appendChild(list.render());
    } else if (path === '/picker') {
      const picker = new Picker(this);      
      document.body.appendChild(picker.render());
    }
  }
  
  private clearBody() {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  }
}



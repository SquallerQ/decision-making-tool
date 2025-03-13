import { Router } from '../router';

interface Option {
  id: string;
  title: string,
  weight: number;
}

export class List {
  private router: Router;
  private options: Option[];

  constructor(router: Router) {
    this.router = router;
    this.options = [{ id: "#1", title: "", weight: 0 }];
  }

  public render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'list-container';

    const title = document.createElement('h1');
    title.textContent = 'Decision Making Tool';

    const button = document.createElement('button');
    button.textContent = 'Go to Picker Page';
    button.addEventListener('click', () => this.router.navigateTo('picker'));

    const list = document.createElement('ul');
    list.className = 'options-list';
    this.options.forEach((option) => list.appendChild(this.createOptionElement(option)));

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Option';
    addButton.className = 'btn';
    addButton.addEventListener('click', () => {
      console.log('aaaaa');
    })

    container.appendChild(title);
    container.appendChild(button);
    container.appendChild(list);
    container.appendChild(addButton);

    return container;
  }

  private createOptionElement(option: Option): HTMLElement {
    const li = document.createElement('li');
    li.className = 'option-item'

    const idLabel = document.createElement('label');
    idLabel.className = 'option-id';
    idLabel.textContent = option.id;
    idLabel.setAttribute('for', `option${option.id}`);

    const titleInput = document.createElement("input");
    titleInput.className = "option-title";
    titleInput.setAttribute("placeholder", "Title");
    titleInput.value = option.title;

    const weightInput = document.createElement("input");
    weightInput.className = "option-weight";
    weightInput.setAttribute("placeholder", "Weight");
    weightInput.setAttribute("type", "number");
    weightInput.value = option.weight.toString();

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn";

    li.appendChild(idLabel)
    li.appendChild(titleInput)
    li.appendChild(weightInput)
    li.appendChild(deleteButton)
    return li;
  }
}


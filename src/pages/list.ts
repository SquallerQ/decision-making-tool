import { Router } from '../router';
import { saveOptions, getOptions } from '../utils/storage';
import { generateId, validateTitle, validateWeight } from '../utils/helpers';

interface Option {
  id: string;
  title: string,
  weight: number | null;
}

export class List {
  private router: Router;
  private options: Option[];

  constructor(router: Router) {
    this.router = router;
    this.options = getOptions() || [{ id: "#1", title: "", weight: null }];
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
      const newOption = { id: generateId(this.options), title: "", weight: null }
      this.options.push(newOption);
      saveOptions(this.options);
      list.appendChild(this.createOptionElement(newOption));
    })

    container.append(title, button, list, addButton)
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
    titleInput.addEventListener("input", () => {
      titleInput.value = validateTitle(titleInput.value);
      option.title = titleInput.value;
      saveOptions(this.options);
    });

    const weightInput = document.createElement("input");
    weightInput.className = "option-weight";
    weightInput.setAttribute("placeholder", "Weight");
    weightInput.setAttribute("type", "number");
    weightInput.value = option.weight !== null ? option.weight.toString() : "";
    weightInput.addEventListener("input", () => {
      weightInput.value = validateWeight(weightInput.value);
      option.weight = parseInt(weightInput.value) || null;
      saveOptions(this.options);
    });
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "option-btn";
    deleteButton.addEventListener("click", () => {
      this.options = this.options.filter((opt) => opt.id !== option.id);
      li.remove();
      saveOptions(this.options);
    });


    li.append(idLabel, titleInput, weightInput, deleteButton)
    return li;
  }
}


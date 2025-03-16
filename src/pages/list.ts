import { Router } from '../router';
import { saveOptions, getOptions } from '../utils/storage';
import { validateWeight } from '../utils/helpers';
import { PasteListModal } from "../components/modal";
import { Option } from '../types';
import { IdGenerator } from '../utils/idGenerator';

export class List {
  private router: Router;
  private options: Option[];
  private list: HTMLUListElement;

  constructor(router: Router) {
    this.router = router;
    this.options = getOptions() || [{ id: "#1", title: "", weight: null }];
    this.list = document.createElement("ul");
    this.list.className = "options-list";
  }

  public render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'list-container';

    const title = document.createElement('h1');
    title.textContent = 'Decision Making Tool';

    const button = document.createElement('button');
    button.textContent = 'Go to Picker Page';
    button.addEventListener('click', () => this.router.navigateTo('picker'));

    this.options.forEach((option) => this.list.appendChild(this.createOptionElement(option)));

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Option';
    addButton.className = 'btn';
    addButton.addEventListener('click', () => {
      const newOption = { id: IdGenerator.generateId(this.options), title: "", weight: null }
      this.options.push(newOption);
      saveOptions(this.options);
      this.list.appendChild(this.createOptionElement(newOption));
    })

    const pasteButton = document.createElement('button');
    pasteButton.textContent = 'Paste List';
    pasteButton.className = 'btn';
    pasteButton.addEventListener('click', () => this.openPasteModal());

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear List';
    clearButton.className = 'btn';
    clearButton.addEventListener('click', () => this.clearList());

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save List to file';
    saveButton.className = 'btn';
    saveButton.addEventListener('click', () => this.saveList());

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load List from file';
    loadButton.className = 'btn';
    loadButton.addEventListener('click', () => this.loadList())

    container.append(title, button, this.list, addButton, pasteButton, clearButton, saveButton, loadButton);
    return container;
  }

  private createOptionElement(option: Option): HTMLElement {
    const li = document.createElement('li');
    li.className = 'option-item'

    const idLabel = document.createElement('label');
    idLabel.className = 'option-id';
    idLabel.textContent = option.id;
    idLabel.setAttribute('for', `option${option.id}`);
    idLabel.addEventListener('click', () => {
      titleInput.focus();
    });

    const titleInput = document.createElement("input");
    titleInput.className = "option-title";
    titleInput.setAttribute("placeholder", "Title");
    titleInput.value = option.title;
    titleInput.addEventListener("input", () => {
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

  private openPasteModal() {
    if (PasteListModal.isModalOpen) {
      return;
    }
    const modal = new PasteListModal((newOptions) => {
      newOptions.forEach(option => {
        option.id = IdGenerator.generateId(this.options);
        this.options.push(option);
        this.list.appendChild(this.createOptionElement(option));
      });
      saveOptions(this.options);
    });

    document.body.appendChild(modal.render());
  }
  private clearList():void {
    this.options = [];
    this.list.replaceChildren();
    saveOptions(this.options);
  }
  private saveList(): void {
    const dataToSave = {
      options: this.options,
      nextId: IdGenerator.generateId(this.options),
    };
    const jsonData = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'options.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  private loadList(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          try {
            const parsedData: { options: Option[]; nextId: string } = JSON.parse(content);
            this.options = parsedData.options;
            saveOptions(this.options);
            if (parsedData.nextId) {
              const idNumber = parseInt(parsedData.nextId.replace('#', ''), 10);
              if (!isNaN(idNumber)) {
                IdGenerator.setIdCounter(idNumber - 1);
              }
            }
            this.list.replaceChildren();
            this.options.forEach((option) => this.list.appendChild(this.createOptionElement(option)));
          } catch (error) {
            console.error('Error parsing JSON file', error);
          }
        };

        reader.readAsText(file);
      }
    });
    input.click();
  }
}
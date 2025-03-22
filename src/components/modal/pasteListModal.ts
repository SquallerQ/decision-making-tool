import type { Option } from '../../types';
import { parseCSV } from "../../utils/helpers";

export class PasteListModal {
  public static isModalOpen: boolean = false;
  private onConfirm: (options: Option[]) => void;
  private modal: HTMLDivElement;
  private textArea: HTMLTextAreaElement;
  private overlay: HTMLDivElement;
  
  constructor(onConfirm: (options: Option[]) => void) {
    this.onConfirm = onConfirm;
    this.modal = document.createElement("div");
    this.textArea = document.createElement("textarea");
    this.overlay = document.createElement("div");

    this.createModalBody();
    this.createModalEvents();
    PasteListModal.isModalOpen = true;
    setTimeout(() => this.textArea.focus(), 0);
  }

  public render(): HTMLElement {
    return this.modal;
  }
  
  private createModalBody():void {
    this.textArea.className = "modal-textarea";
    this.textArea.placeholder =  
      `Paste a list of new options in a CSV-like format:\n\n` +
      `title,1                 -> | title                 | 1 |\n` +
      `title with whitespace,2 -> | title with whitespace | 2 |\n` +
      `title , with , commas,3 -> | title , with , commas | 3 |\n` +
      `title with "quotes",4   -> | title with "quotes"   | 4 |`;

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.addEventListener("click", () => this.handleConfirm());

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => this.close());

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "modal-buttons";
    buttonContainer.append(confirmButton, cancelButton);

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.append(this.textArea, buttonContainer);

    this.overlay.className = "modal-overlay";
    this.overlay.append(modalContent);
    this.overlay.addEventListener("click", (event) => { if (event.target === this.overlay) this.close(); });

    this.modal.className = "modal";
    this.modal.append(this.overlay);
  }

  private createModalEvents():void {
    document.addEventListener("keydown", this.handleKeydown);
    document.body.style.overflow = "hidden";
  }

  private handleConfirm():void {
    const newOptions = parseCSV(this.textArea.value);
    if (newOptions.length > 0) {
      this.onConfirm(newOptions);
    }
    this.close();
  }

  private close():void {
    document.removeEventListener("keydown", this.handleKeydown);
    document.body.style.overflow = "";
    this.modal.remove();
    PasteListModal.isModalOpen = false;
  }

  private handleKeydown = (event: KeyboardEvent):void => {    
    if (event.key === "Escape") {
      this.close();
    }
  };
}
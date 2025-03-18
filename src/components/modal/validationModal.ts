export class ValidationModal {
  private modal: HTMLDivElement;
  private overlay: HTMLDivElement;
  public static isModalOpen: boolean = false;

  constructor(private onClose: () => void) {
    this.modal = document.createElement("div");
    this.overlay = document.createElement("div");

    this.createModalBody();
    this.createModalEvents();
    ValidationModal.isModalOpen = true;
  }

  private createModalBody() {
    const message = document.createElement("p");
    message.textContent = `Please add at least 2 valid options.\n\n` +
    `An option is considered valid if its title is not empty and its weight is greater than 0`;

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.className = "modal-close";
    closeButton.addEventListener("click", () => this.close());
    setTimeout(() => closeButton.focus(), 0);

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.append(message, closeButton);

    this.overlay.className = "modal-overlay";
    this.overlay.append(modalContent);
    this.overlay.addEventListener("click", (e) => { if (e.target === this.overlay) this.close(); });

    this.modal.className = "modal";
    this.modal.append(this.overlay);
  }

  private createModalEvents() {
    document.addEventListener("keydown", this.handleKeydown);
    document.body.style.overflow = "hidden";
  }

  public render(): HTMLElement {
    return this.modal;
  }
  private close() {
    document.removeEventListener("keydown", this.handleKeydown);
    document.body.style.overflow = "";
    if (this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal);
    }
    ValidationModal.isModalOpen = false;
    this.onClose();
  }

  private handleKeydown = (event: KeyboardEvent) => {    
    if (event.key === "Escape") {
      this.close();
    }
  };
}
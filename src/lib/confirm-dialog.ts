export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function requestConfirm({
  title,
  message,
  confirmLabel = "确定",
  cancelLabel = "取消",
}: ConfirmOptions): Promise<boolean> {
  const dialog = document.querySelector<HTMLDialogElement>("[data-confirm-dialog]");
  const titleElement = dialog?.querySelector<HTMLElement>("[data-confirm-title]");
  const messageElement = dialog?.querySelector<HTMLElement>("[data-confirm-message]");
  const cancelButton = dialog?.querySelector<HTMLButtonElement>("[data-confirm-cancel]");
  const acceptButton = dialog?.querySelector<HTMLButtonElement>("[data-confirm-accept]");

  if (!dialog || !titleElement || !messageElement || !cancelButton || !acceptButton || dialog.open) {
    return Promise.resolve(false);
  }

  titleElement.textContent = title;
  messageElement.textContent = message;
  cancelButton.textContent = cancelLabel;
  acceptButton.textContent = confirmLabel;

  return new Promise((resolve) => {
    const cleanup = () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("cancel", onCancel);
      cancelButton.removeEventListener("click", onCancelButton);
      acceptButton.removeEventListener("click", onAccept);
    };
    const onClose = () => {
      const confirmed = dialog.returnValue === "confirm";
      cleanup();
      resolve(confirmed);
    };
    const closeAsCancel = () => {
      if (dialog.open) dialog.close("cancel");
    };
    const onCancel = (event: Event) => {
      event.preventDefault();
      closeAsCancel();
    };
    const onCancelButton = () => closeAsCancel();
    const onAccept = () => dialog.close("confirm");

    dialog.addEventListener("close", onClose);
    dialog.addEventListener("cancel", onCancel);
    cancelButton.addEventListener("click", onCancelButton);
    acceptButton.addEventListener("click", onAccept);

    try {
      dialog.showModal();
      cancelButton.focus();
    } catch {
      cleanup();
      resolve(false);
    }
  });
}

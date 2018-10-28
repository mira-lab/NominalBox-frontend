import {EventEmitter, Output, Input} from '@angular/core';

export class ModalForm {
  @Input() modalVisible: boolean;
  @Output() modalVisibleChange = new EventEmitter<boolean>();

  errorMessage = 'Oops! Something went wrong while submitting the form.';
  successMessage = 'Thank you! Your form has been submitted!';
  showError = false;
  showSuccess = false;
  formSubmitting = false;

  closeModalForm() {
    this.resetAllEvents();
    this.modalVisibleChange.emit(false);
  }

  resetAllEvents() {
    this.errorMessage = 'Oops! Something went wrong while submitting the form.';
    this.successMessage = 'Thank you! Your form has been submitted!';
    this.showError = false;
    this.showSuccess = false;
  }

  showErrorMessage(msg?: string) {
    if (msg) {
      this.errorMessage = msg;
    }
    this.showError = true;
  }

  showSuccessMessage(msg?: string) {
    if (msg) {
      this.successMessage = msg;
    }
    this.showSuccess = true;
  }
}

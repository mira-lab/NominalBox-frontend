export class ChangePin {

  constructor(public oldPin: string,
              public repeatOldPin: string,
              public newPin: string,
              public repeatNewPin: string) {
  }

  checkValid(): boolean {
    return !!(this.oldPin &&
      this.repeatOldPin &&
      this.newPin &&
      this.repeatNewPin &&
      this.newPin === this.repeatNewPin &&
      this.oldPin === this.repeatOldPin);
  }
}

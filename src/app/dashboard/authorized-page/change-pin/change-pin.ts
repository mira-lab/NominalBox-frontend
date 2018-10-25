export class ChangePin {

  constructor(public oldPin: string,
              public newPin: string,
              public repeatNewPin: string) {
  }

  checkValid(): boolean {
    return !!(this.oldPin &&
      this.newPin &&
      this.repeatNewPin &&
      this.newPin === this.repeatNewPin);
  }
}

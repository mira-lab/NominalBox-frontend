export class RepackMirabox {
  constructor(public checkBox: boolean,
              public pin: string,
              public email: string) {
  }
  checkFormValid(): boolean {
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (this.checkBox && this.pin.length <= 0) {
      throw new Error('Pin field can\'t be empty!');
    }
    if (this.checkBox && this.email.length <= 0) {
      throw new Error('Email field can\'t be empty!');
    }
    if (this.checkBox && !EMAIL_REGEX.test(this.email)){
      throw new Error('Email isn\'t valid!');
    }
    return true;
  }
}

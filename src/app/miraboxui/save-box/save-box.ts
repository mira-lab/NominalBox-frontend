export class SaveBox {

  constructor(public miraBoxTitle: string,
              public pin: string,
              public repeatPin: string,
              public email: string,
              public repeatEmail: string) {
  }

  checkFormValid(): boolean {
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (this.miraBoxTitle.length <= 0) {
      throw new Error('MiraBox title field can\'t be empty!');
    }
    if (this.pin.length <= 0 || this.repeatPin.length <= 0) {
      throw new Error('Pin field(s) can\'t be empty!');
    }
    if (this.email.length <= 0 || this.repeatEmail.length <= 0) {
      throw new Error('Email field(s) can\'t be empty!');
    }
    if (this.miraBoxTitle.length > 32) {
      throw new Error('MiraBox title must be less than 32 characters long!');
    }
    if (!/^[\da-zA-Z\.\-_]+$/.test(this.miraBoxTitle)) {
      throw new Error('MiraBox title can only contain letters, numbers, underscores, dots and minuses!');
    }
    if (this.pin !== this.repeatPin) {
      throw new Error('Pins doesn\'t match!');
    }
    if (this.pin.length > 32) {
      throw new Error('Pin must be less then 32 characters long!');
    }
    if (this.email !== this.repeatEmail) {
      throw new Error('Emails doesn\'t match!');
    }
    if (!EMAIL_REGEX.test(this.email)) {
      throw new Error('Email isn\'t valid!');
    }
    return true;
  }

}

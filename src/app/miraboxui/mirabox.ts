export interface MiraBoxItem {
  currency: string;
  address: string;
  contract: string;
}

export class MiraBox {

  constructor(private version: string = '3.0',
              private title: string = '',
              private privateKey: string,
              private miraBoxItems: MiraBoxItem[] = []) {

  }

  public addMiraBoxItem(_currency: string, _address: string, _contract: string) {
    this.miraBoxItems.push({currency: _currency, address: _address, contract: _contract});
  }
  public changeTitle(newTitle: string){
    this.title = newTitle;
  }
}

export interface MiraBoxItem {
  currency: string;
  address: string;
  contract: string;
}

export class MiraBox {

  constructor(private version: string,
              private title: string,
              private privateKey: string,
              private miraBoxItems: MiraBoxItem[] = []) {
    this.version = '3.0';

  }

  private static fromJsonObj(jsonObj): MiraBox {
    const miraBoxProperties = [
      'version', 'title', 'privateKey', 'miraBoxItems'
    ];
    const miraBoxItemProperties = [
      'currency', 'address', 'contract'
    ];
    // ToDo Make more readable code here:
    const isCorrectMiraBox = miraBoxProperties.filter(property => jsonObj.hasOwnProperty(property)).length === miraBoxProperties.length;
    const isCorrectMiraBoxItems = jsonObj.miraBoxItems.filter((miraBoxItem) => {
      return miraBoxItemProperties.filter((property) => {
        return miraBoxItem.hasOwnProperty(property);
      }).length === miraBoxItemProperties.length;
    }).length === jsonObj.miraBoxItems.length;
    if (isCorrectMiraBox && isCorrectMiraBoxItems) {
      return new MiraBox(
        jsonObj.version,
        jsonObj.title,
        jsonObj.privateKey,
        jsonObj.miraBoxItems);
    } else {
      throw Error('Bad MiraBox');
    }
  }

  static fromString(input: string): MiraBox {
    const miraBoxObj = JSON.parse(input);
    return MiraBox.fromJsonObj(miraBoxObj);
  }

  public addMiraBoxItem(_currency: string, _address: string, _contract: string): void {
    this.miraBoxItems.push({currency: _currency, address: _address, contract: _contract});
  }

  public changeTitle(newTitle: string): void {
    this.title = newTitle;
  }

  public getMiraBoxItems(): MiraBoxItem[] {
    return this.miraBoxItems;
  }

  public getPrivateKey(): string {
    return this.privateKey;
  }

  public getTitle(): string {
    return this.title;
  }

  public getMiraBoxFileName(): string {
    return `${this.title}.mbox`;
  }

  public toJsonObj(): any {
    return {
      'version': this.version,
      'title': this.title,
      'privateKey': this.privateKey,
      'miraBoxItems': this.miraBoxItems
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJsonObj());
  }


}

import { MiraboxuiModule } from './miraboxui.module';

describe('MiraboxuiModule', () => {
  let miraboxuiModule: MiraboxuiModule;

  beforeEach(() => {
    miraboxuiModule = new MiraboxuiModule();
  });

  it('should create an instance', () => {
    expect(miraboxuiModule).toBeTruthy();
  });
});

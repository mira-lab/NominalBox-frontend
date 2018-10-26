import { MiraboxModule } from './mirabox.module';

describe('MiraboxModule', () => {
  let miraboxModule: MiraboxModule;

  beforeEach(() => {
    miraboxModule = new MiraboxModule();
  });

  it('should create an instance', () => {
    expect(miraboxModule).toBeTruthy();
  });
});

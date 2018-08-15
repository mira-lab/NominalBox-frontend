import { FileUploadModule } from './fileupload.module';

describe('FileUploadModule', () => {
  let fileUploadModule: FileUploadModule;

  beforeEach(() => {
    fileUploadModule = new FileUploadModule();
  });

  it('should create an instance', () => {
    expect(fileUploadModule).toBeTruthy();
  });
});

export default class CustomFile {
  parts: BlobPart[];
  filename: string;
  properties: FilePropertyBag;

  constructor(parts: BlobPart[], filename: string, properties: FilePropertyBag = {}) {
    this.parts = parts;
    this.filename = filename;
    this.name = filename;
    this.properties = properties;
    if (!properties.type) {
      this.properties.type = '';
    }
    const blob = new Blob(parts, { type: properties.type });
    this.size = blob.size;
    this.type = blob.type;
    this.lastModified = properties.lastModified || Date.now();
  }

  async text(): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(this.toBlob());
    });
  }

  toBlob(): Blob {
    return new Blob(this.parts, { type: this.type });
  }
  async toDataURL(): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(this.toBlob());
    });
  }
}

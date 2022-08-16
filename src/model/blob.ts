type BlobConstructorProps = {
  ID: string;
  signedUrl: string | null;
  status: BlobUploadStatus;
};

export enum BlobUploadStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class BlobUpload {
  id: string;
  signedUploadURL: string | null;
  status: BlobUploadStatus;

  constructor({ ID, signedUrl, status }: BlobConstructorProps) {
    this.id = ID;
    this.signedUploadURL = signedUrl;
    this.status = status;
  }
}

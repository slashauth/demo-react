type BlobConstructorProps = {
  id: string;
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

  constructor({ id, signedUrl, status }: BlobConstructorProps) {
    this.id = id;
    this.signedUploadURL = signedUrl;
    this.status = status;
  }
}

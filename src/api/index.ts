import { Config } from '../config';
import { AppMetadata } from '../model/app-metadata';
import { BlobUpload, BlobUploadStatus } from '../model/blob';
import { SlashauthEvent } from '../model/event';
import { SlashauthFile, FileConstructorProps } from '../model/file';
import { User } from '../model/user';

type MintResponse = {
  success: boolean;
  txHash: string;
  scanUrl: string;
};

export type CreateFileInput = {
  blob_id: string;
  name: string;
  roles_required: string[];
  description?: string;
};

export type PatchFileInput = {
  name?: string;
  rolesRequired?: string[];
  description?: string;
};

export class API {
  private readonly _config: Config;
  private readonly _accessToken: string | null;

  constructor(private readonly config: Config, accessToken: string) {
    this._config = config;
    this._accessToken = accessToken;
  }

  public async getAppMetadata(): Promise<AppMetadata | null> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + '/metadata', {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'GET',
    });

    if (response.status !== 200) {
      console.error('Failed to fetch app');
      return null;
    }

    const elem = await response.json();
    return new AppMetadata(elem.name, elem.description);
  }

  public async getMe(): Promise<User> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + '/me', {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'GET',
    });

    if (response.status > 299 || response.status < 200) {
      console.error('Failed to add event');
    }

    const elem = await response.json();
    return new User(elem.address, elem.nickname, elem.roles, elem.dateTime);
  }

  public async patchMe(nickname: string): Promise<User> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + '/me', {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'PATCH',
      body: JSON.stringify({ nickname }),
    });

    if (response.status > 299 || response.status < 200) {
      console.error('Failed to add event');
    }

    const elem = await response.json();
    return new User(elem.address, elem.nickname, elem.roles, elem.dateTime);
  }

  public async addEvent(event: SlashauthEvent): Promise<SlashauthEvent> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + '/event', {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'POST',
      body: JSON.stringify(event.toJSONBlob()),
    });

    if (response.status > 299 || response.status < 200) {
      console.error('Failed to add event');
    }

    return event;
  }

  public async mintToken(roleName: string): Promise<MintResponse> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + '/tokens', {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'POST',
      body: JSON.stringify({
        roleLevel: roleName,
      }),
    });

    if (response.status > 299 || response.status < 200) {
      console.error('Failed to mint token');
    }

    const elem = await response.json();
    return elem;
  }

  public async getEvents(): Promise<SlashauthEvent[]> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + '/events', {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'GET',
    });

    if (response.status !== 200) {
      console.error('Failed to get events');
      return [] as SlashauthEvent[];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await response.json()).map((elem: Record<string, any>) => {
      return new SlashauthEvent(
        elem.name,
        elem.description,
        elem.link,
        elem.dateTime
      );
    });

    return data;
  }

  public async getUsers(): Promise<User[]> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + '/users', {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'GET',
    });

    if (response.status !== 200) {
      console.error('Failed to get users');
      return [] as User[];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await response.json()).map((elem: Record<string, any>) => {
      return new User(elem.address, elem.nickname, elem.roles, elem.dateTime);
    });

    return data;
  }

  // TODO: Add paging parameters.
  public async listFiles(): Promise<SlashauthFile[]> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + '/files', {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'GET',
    });

    if (response.status !== 200) {
      console.error('Failed to index files');
      return [] as SlashauthFile[];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await response.json()).data.map(
      (elem: Record<string, unknown>) => {
        return new SlashauthFile(elem as FileConstructorProps);
      }
    );

    return data;
  }

  public async getFile(fileID: string): Promise<SlashauthFile> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + '/files/' + fileID, {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'GET',
    });

    if (response.status !== 200) {
      console.error('Failed to get file');
      return null;
    }

    const elem = await response.json();
    return new SlashauthFile(elem.data);
  }

  public async getPresignedURLForFile(fileID: string): Promise<string> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(
      this._config.restDomain + `/files/${fileID}/url`,
      {
        headers: {
          ...this.defaultHeaders(),
          ...authHeader,
        },
        method: 'GET',
      }
    );

    if (response.status !== 200) {
      console.error('Failed to get url for file');
      return null;
    }

    const elem = await response.json();
    return elem.data.url;
  }

  public async createFile(input: CreateFileInput): Promise<SlashauthFile> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + '/files', {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'POST',
      body: JSON.stringify(input),
    });

    if (response.status > 299 || response.status < 200) {
      console.error('Failed to patch file');
    }

    const elem = await response.json();
    return new SlashauthFile(elem.data);
  }

  public async patchFile(
    fileID: string,
    { name, rolesRequired, description }: PatchFileInput
  ): Promise<SlashauthFile> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + `/files/${fileID}`, {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'PATCH',
      body: JSON.stringify({
        name,
        roles_required: rolesRequired,
        description,
      }),
    });

    if (response.status > 299 || response.status < 200) {
      console.error('Failed to patch file');
    }

    const elem = await response.json();
    return new SlashauthFile(elem.data);
  }

  public async deleteFile(fileID: string): Promise<SlashauthFile> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + `/files/${fileID}`, {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'DELETE',
    });

    if (response.status > 299 || response.status < 200) {
      console.error('Failed to delete file');
    }

    const elem = await response.json();
    return new SlashauthFile(elem.data);
  }

  public async createBlobUpload(
    mimeType: string,
    fileSize: number
  ): Promise<BlobUpload> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + '/blobs', {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'POST',
      body: JSON.stringify({
        mime_type: mimeType,
        file_size: fileSize,
      }),
    });

    if (response.status > 299 || response.status < 200) {
      console.error('Failed to create blob upload');
    }

    const elem = await response.json();
    return new BlobUpload(elem.data);
  }

  public async patchBlobUpload(
    id: string,
    input: {
      status: BlobUploadStatus;
    }
  ): Promise<BlobUpload> {
    const authHeader = {};
    if (this._accessToken) {
      authHeader['Authorization'] = `Bearer ${this._accessToken}`;
    }
    const response = await fetch(this._config.restDomain + `/blobs/${id}`, {
      headers: {
        ...this.defaultHeaders(),
        ...authHeader,
      },
      method: 'PATCH',
      body: JSON.stringify(input),
    });

    if (response.status > 299 || response.status < 200) {
      console.error('Failed to patch blob upload');
    }

    const elem = await response.json();
    return new BlobUpload(elem);
  }

  private defaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Slashauth-Client': this._config.appClientID,
    };
  }
}

import { Config } from '../config';
import { AppMetadata } from '../model/app-metadata';
import { SlashauthEvent } from '../model/event';
import { User } from '../model/user';

export class API {
  private readonly _config: Config;
  private readonly _accessToken: string | null;

  constructor(private readonly config: Config, accessToken: string) {
    this._config = config;
    this._accessToken = accessToken;
  }

  public async getAppMetadata(): Promise<AppMetadata | null> {
    const response = await fetch(this._config.restDomain + '/metadata', {
      headers: {
        ...this.defaultHeaders(),
        Authorization: `Bearer ${this._accessToken}`,
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
    const response = await fetch(this._config.restDomain + '/me', {
      headers: {
        ...this.defaultHeaders(),
        Authorization: `Bearer ${this._accessToken}`,
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
    const response = await fetch(this._config.restDomain + '/me', {
      headers: {
        ...this.defaultHeaders(),
        Authorization: `Bearer ${this._accessToken}`,
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
    const response = await fetch(this._config.restDomain + '/events', {
      headers: {
        ...this.defaultHeaders(),
        Authorization: `Bearer ${this._accessToken}`,
      },
      method: 'PATCH',
      body: JSON.stringify(event),
    });

    if (response.status > 299 || response.status < 200) {
      console.error('Failed to add event');
    }

    return event;
  }

  public async getEvents(): Promise<SlashauthEvent[]> {
    const response = await fetch(this._config.restDomain + '/events', {
      headers: {
        ...this.defaultHeaders(),
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
    const response = await fetch(this._config.restDomain + '/users', {
      headers: {
        ...this.defaultHeaders(),
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

  private defaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Slashauth-Client': this._config.appClientID,
    };
  }
}

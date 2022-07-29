import { useSlashAuth } from '@slashauth/slashauth-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { API } from '../api';
import { RoleNameAdmin, RoleNameMember } from '../constants';
import { AppContext, ConfigContext } from '../context';
import { AppMetadata } from '../model/app-metadata';
import { SlashauthEvent } from '../model/event';
import { User } from '../model/user';

type Props = {
  children: React.ReactNode;
};

type FetchedData<T> = {
  data: T | null;
  loading: boolean;
};

const AppProvider = ({ children }: Props) => {
  const [appMetadata, setAppMetadata] = useState<FetchedData<AppMetadata>>({
    data: undefined,
    loading: false,
  });

  const [events, setEvents] = useState<FetchedData<SlashauthEvent[]>>({
    data: undefined,
    loading: false,
  });

  const [roles, setRoles] = useState<{
    [roleName: string]: FetchedData<boolean>;
  }>({});

  const [users, setUsers] = useState<FetchedData<User[]>>({
    data: undefined,
    loading: false,
  });

  const [me, setMe] = useState<FetchedData<User>>({
    data: undefined,
    loading: false,
  });

  const { getAccessTokenSilently, isAuthenticated, hasRole } = useSlashAuth();
  const config = useContext(ConfigContext);

  const [lastRoleDataAdmin, setLastRoleDataAdmin] = useState(false);
  const [lastRoleDataMember, setLastRoleDataMember] = useState(false);

  if (!isAuthenticated && events.data !== undefined) {
    setEvents({ data: undefined, loading: false });
  }

  if (!isAuthenticated && roles && Object.keys(roles).length !== 0) {
    setRoles({});
  }

  if (!isAuthenticated && me.data !== undefined) {
    setMe({ data: undefined, loading: false });
  }

  const addRole = useCallback((roleName: string, response: boolean) => {
    setRoles((existing) => ({
      ...existing,
      [roleName]: {
        data: response,
        loading: false,
      },
    }));
  }, []);

  const fetchRoleData = useCallback(
    async (roleName: string): Promise<boolean> => {
      if (!isAuthenticated) {
        return false;
      }
      setRoles((existing) => ({
        ...(existing || {}),
        [roleName]: {
          data: undefined,
          loading: true,
        },
      }));
      try {
        const roleResponse = await hasRole(roleName);
        addRole(roleName, roleResponse);
        return roleResponse;
      } catch (err) {
        console.error('Failed to fetch role', err);
        addRole(roleName, false);
        return false;
      }
    },
    [addRole, hasRole, isAuthenticated]
  );

  const fetchRoles = async () => {
    await fetchRoleData(RoleNameMember);
    await fetchRoleData(RoleNameAdmin);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setRoles(undefined);
    } else {
      fetchRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchMe = useCallback(async (): Promise<User | null> => {
    setTimeout(
      () =>
        setMe({
          ...me,
          loading: true,
        }),
      0
    );
    return getAccessTokenSilently().then((token) => {
      const api = new API(config, token);
      return api
        .getMe()
        .then((user) => {
          setMe({
            data: user,
            loading: false,
          });
          return user;
        })
        .catch((err) => {
          console.error('Error fetching me', err);
          setMe({
            data: null,
            loading: false,
          });
          return null;
        });
    });
  }, [config, getAccessTokenSilently, me]);

  const patchMe = useCallback(
    async (nickname: string): Promise<User | null> => {
      return getAccessTokenSilently().then((token) => {
        const api = new API(config, token);
        return api
          .patchMe(nickname)
          .then((user) => {
            setMe({
              data: user,
              loading: false,
            });
            return user;
          })
          .catch((err) => {
            console.error('Error fetching me', err);
            return null;
          });
      });
    },
    [config, getAccessTokenSilently]
  );

  const addEvent = useCallback(
    async (ev: SlashauthEvent): Promise<SlashauthEvent | null> => {
      return getAccessTokenSilently().then((token) => {
        const api = new API(config, token);
        return api
          .addEvent(ev)
          .then((ev) => {
            return ev;
          })
          .catch((err) => {
            console.error('Error adding event', err);
            return null;
          });
      });
    },
    [config, getAccessTokenSilently]
  );

  const fetchAppMetadata =
    useCallback(async (): Promise<AppMetadata | null> => {
      setTimeout(
        () =>
          setAppMetadata({
            ...appMetadata,
            loading: true,
          }),
        0
      );
      return getAccessTokenSilently().then((token) => {
        const api = new API(config, token);
        return api
          .getAppMetadata()
          .then((metadata) => {
            setAppMetadata({
              data: metadata,
              loading: false,
            });
            return metadata;
          })
          .catch((err) => {
            console.error('Error fetching app metadata', err);
            setAppMetadata({
              data: null,
              loading: false,
            });
            return null;
          });
      });
    }, [appMetadata, config, getAccessTokenSilently]);

  const fetchUsers = useCallback(async (): Promise<User[] | null> => {
    if (!isAuthenticated) {
      return null;
    }
    setUsers((existing) => ({
      ...existing,
      loading: true,
    }));

    return getAccessTokenSilently().then((token) => {
      const api = new API(config, token);
      return api
        .getUsers()
        .then((users) => {
          setUsers({
            data: users,
            loading: false,
          });
          return users;
        })
        .catch((err) => {
          console.error('Error fetching users: ', err);
          setUsers({
            data: null,
            loading: false,
          });
          return null;
        });
    });
  }, [config, getAccessTokenSilently, isAuthenticated]);

  const fetchEvents = useCallback(async (): Promise<
    SlashauthEvent[] | null
  > => {
    if (!isAuthenticated) {
      return null;
    }
    setEvents({
      ...events,
      loading: true,
    });

    return getAccessTokenSilently().then((token) => {
      const api = new API(config, token);
      return api
        .getEvents()
        .then((events) => {
          setEvents({
            data: events,
            loading: false,
          });
          return events;
        })
        .catch((err) => {
          console.error('Error fetching events: ', err);
          setEvents({
            data: null,
            loading: false,
          });
          return null;
        });
    });
  }, [config, events, getAccessTokenSilently, isAuthenticated]);

  if (
    roles &&
    roles[RoleNameAdmin] &&
    !roles[RoleNameAdmin].loading &&
    roles[RoleNameAdmin].data !== undefined &&
    lastRoleDataAdmin !== roles[RoleNameAdmin].data
  ) {
    if (roles[RoleNameAdmin].data && isAuthenticated) {
      fetchEvents();
      fetchUsers();
    }
    setLastRoleDataAdmin(roles[RoleNameAdmin].data);
  }

  if (
    roles &&
    roles[RoleNameMember] &&
    !roles[RoleNameMember].loading &&
    roles[RoleNameMember].data !== undefined &&
    lastRoleDataMember !== roles[RoleNameMember].data
  ) {
    if (roles[RoleNameMember].data && isAuthenticated) {
      fetchEvents();
      fetchMe();
    }
    setLastRoleDataMember(roles[RoleNameMember].data);
  }

  return (
    <AppContext.Provider
      value={{
        appMetadata: {
          ...appMetadata,
          fetch: fetchAppMetadata,
        },
        events: {
          ...events,
          fetch: fetchEvents,
          addEvent: (event: SlashauthEvent) => {
            addEvent(event);
            setEvents({
              ...events,
              data: [...(events.data || []), event],
            });
          },
        },
        roles: {
          data: {
            ...roles,
          },
          fetch: fetchRoleData,
          fetchRoles,
        },
        users: {
          ...users,
          fetch: fetchUsers,
        },
        me: {
          ...me,
          fetch: fetchMe,
          patch: patchMe,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

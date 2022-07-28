import { useSlashAuth } from '@slashauth/slashauth-react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { LoggedOut } from '../../common/components/LoggedOut';
import { NotAuthorized } from '../../common/components/NotAuthorized';
import { BeatLoader } from '../../common/components/spinners/beat-loader';
import ContentLayout from '../../common/layout/content';
import { RoleNameMember } from '../../constants';
import { AppContext } from '../../context';
import TopBar from '../../features/top-bar';
import accountGradient from '../../common/gradients/account-gradient.png';
import { InputWithValidation } from '../../common/form/InputWithValidation';
import { PrimaryButton } from '../../common/components/Buttons';
import { classNames } from '../../util/classnames';
import {
  SocialButton,
  SocialProvider,
} from '../../common/components/buttons/social-button';
import toast from 'react-hot-toast';

export const AccountPage = () => {
  const { me, roles } = useContext(AppContext);

  const { isAuthenticated } = useSlashAuth();

  const [nicknameValue, setNicknameValue] = useState('');

  const handleSetNickname = useCallback(async () => {
    if (isAuthenticated && me?.patch) {
      me.patch(nicknameValue);
    }
    setNicknameValue('');
  }, [isAuthenticated, me, nicknameValue]);

  const hasRole = useMemo(
    () =>
      isAuthenticated &&
      roles.data &&
      roles.data[RoleNameMember] &&
      roles.data[RoleNameMember].data,
    [isAuthenticated, roles.data]
  );

  const meContent = useMemo(() => {
    if (!isAuthenticated) {
      return <LoggedOut roleNameRequired={RoleNameMember} />;
    }

    if (
      !roles.data ||
      !roles.data[RoleNameMember] ||
      roles.data[RoleNameMember].loading
    ) {
      return <BeatLoader />;
    }

    if (!roles.data[RoleNameMember].data) {
      return <NotAuthorized roleNameRequired={RoleNameMember} />;
    }

    if (!me?.data) {
      return <BeatLoader />;
    }

    return (
      <div className="flex flex-col px-4 md:w-1/2 sm:px-0">
        <div className="flex flex-col pb-10 border-b border-gray-100">
          <h2 className="text-[24px] font-semibold text-primary text-left">
            Set Your Nickname
          </h2>
          <div className="flex flex-row mt-4 space-x-2 text-left">
            <span className="text-[14px] font-medium">Current Nickname:</span>
            <span
              className={classNames(
                'text-[14px] text-left text-secondary',
                (!me.data.nickname || me.data.nickname.length === 0) && 'italic'
              )}
            >
              {!me.data.nickname || me.data.nickname.length === 0
                ? 'No nickname'
                : me.data.nickname}
            </span>
          </div>
          <InputWithValidation
            value={nicknameValue}
            onTextChange={setNicknameValue}
          />
          <div className="flex mt-4 space-x-2">
            <PrimaryButton onClick={handleSetNickname}>Save</PrimaryButton>
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-[24px] font-semibold text-primary text-left mt-8">
            Connect your socials
          </h2>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row items-center space-x-4">
              <div className="text-discord-purple">
                <SocialButton
                  provider={SocialProvider.Discord}
                  hideBackground
                />
              </div>
              <span className="text-[14px] text-secondary">
                Connect your Discord
              </span>
            </div>
            <div className="inline-flex">
              <PrimaryButton
                onClick={() => toast.error('Not implemented yet!')}
              >
                Connect
              </PrimaryButton>
            </div>
          </div>
          <div className="flex flex-col mt-8 space-y-4">
            <div className="flex flex-row items-center space-x-4">
              <div className="text-twitter-blue">
                <SocialButton
                  provider={SocialProvider.Twitter}
                  hideBackground
                />
              </div>
              <span className="text-[14px] text-secondary">
                Connect your Twitter
              </span>
            </div>
            <div className="inline-flex">
              <PrimaryButton
                onClick={() => toast.error('Not implemented yet!')}
              >
                Connect
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  }, [handleSetNickname, isAuthenticated, me?.data, nicknameValue, roles.data]);

  return (
    <>
      <TopBar />
      <div className="relative w-full h-[300px] bg-green">
        <img
          src={accountGradient}
          className={classNames(
            'absolute inset-0 h-[300px] w-full object-cover z-0',
            !hasRole && 'grayscale'
          )}
          alt="Home Gradient"
        />
        <div className="absolute inset-0 flex flex-col">
          <ContentLayout fullHeight>
            <div className="flex flex-col items-start justify-center w-full h-full px-2 sm:w-2/3 sm:px-0 md: xl:w-2/5 text-banner">
              <h1 className="text-[36px] font-semibold">Your Account</h1>
              <p className="text-[21px]">
                Connect your socials and give yourself a nickname!
              </p>
            </div>
          </ContentLayout>
        </div>
      </div>
      <ContentLayout fullHeight additionalClassnames="mt-8">
        <main className="text-center text-primary">
          <div className="mt-8">{meContent}</div>
        </main>
      </ContentLayout>
    </>
  );
};

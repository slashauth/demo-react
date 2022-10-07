import { useMemo } from 'react';
import { BeatLoader } from '../../common/components/spinners/beat-loader';
import { useSlashAuth } from '@slashauth/slashauth-react';
import { PrimaryButton } from '../../common/components/Buttons';

type Props = {
  additionalClassNames?: string;
};

export const AccountButton = ({ additionalClassNames }: Props) => {
  const {
    isTwoStep,
    isLoginReady,
    loginNoRedirectNoPopup,
    isLoading,
    isLoggingIn,
    connect,
    connectedWallet,
  } = useSlashAuth();

  const contents = useMemo(() => {
    if (isLoading || isLoggingIn) {
      return (
        <div className="flex flex-col items-center justify-center">
          <p className="my-4 font-bold text-purple-700 text-md">
            Waiting for wallet interaction. Check your web3 wallet (e.g.
            metamask)
          </p>
          <BeatLoader color="bg-purple-50 text-purple-700" />
        </div>
      );
    }

    const activate = async () => {
      await loginNoRedirectNoPopup();
    };

    if (isTwoStep) {
      if (!connectedWallet) {
        return (
          <PrimaryButton
            additionalClassNames={additionalClassNames}
            onClick={() => connect(false)}
          >
            Connect Wallet
          </PrimaryButton>
        );
      } else if (isLoginReady) {
        return (
          <PrimaryButton
            additionalClassNames={additionalClassNames}
            onClick={() => loginNoRedirectNoPopup()}
          >
            Login
          </PrimaryButton>
        );
      } else {
        return (
          <PrimaryButton
            additionalClassNames={additionalClassNames}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick={() => {}}
            disabled
          >
            Loading...
          </PrimaryButton>
        );
      }
    } else {
      return (
        <PrimaryButton
          additionalClassNames={additionalClassNames}
          onClick={activate}
        >
          {isLoading ? 'Loading...' : 'Login'}
        </PrimaryButton>
      );
    }
  }, [
    additionalClassNames,
    connect,
    connectedWallet,
    isLoading,
    isLoginReady,
    isTwoStep,
    loginNoRedirectNoPopup,
    isLoggingIn,
  ]);

  return <div className="flex items-center justify-start">{contents}</div>;
};

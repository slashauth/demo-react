import TopBar from '../../features/top-bar';
import ContentLayout from '../../common/layout/content';
import homeGradient from '../../common/gradients/home-gradient.png';
import { PrimaryButton, WhiteButton } from '../../common/components/Buttons';
import {
  ArrowRightIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/outline';
import { ReactComponent as GithubIcon } from '../../common/icons/github-mark.svg';

const Home = () => {
  return (
    <>
      <TopBar />
      <div className="relative w-full h-[300px] bg-green">
        <img
          src={homeGradient}
          className="absolute inset-0 h-[300px] w-full object-cover z-0"
          alt="Home Gradient"
        />
        <div className="absolute inset-0 flex flex-col">
          <ContentLayout fullHeight>
            <div className="flex flex-col items-start justify-center w-full h-full px-2 sm:w-2/3 sm:px-0 md: xl:w-2/5 text-banner">
              <h1 className="text-[36px] font-semibold">Welcome!</h1>
              <p className="text-[21px]">
                The frontend and backend code for this app is available on
                Github.
              </p>
              <div className="flex flex-row mt-4 space-x-2">
                <PrimaryButton
                  onClick={() =>
                    window.open('https://github.com/slashauth/demo-react')
                  }
                >
                  <div className="flex flex-row space-x-2 place-items-center">
                    <GithubIcon className="w-auto h-6 text-black" />
                    <div className="content-center">Frontend</div>
                  </div>
                </PrimaryButton>
                <WhiteButton
                  onClick={() =>
                    window.open('https://github.com/slashauth/demo-backend')
                  }
                >
                  <div className="flex flex-row space-x-2 place-items-center">
                    <GithubIcon className="w-auto h-6" />
                    <div className="content-center">Backend</div>
                  </div>
                </WhiteButton>
              </div>
            </div>
          </ContentLayout>
        </div>
      </div>
      <ContentLayout fullHeight additionalClassnames="mt-8">
        <main className="text-center text-primary">
          <div className="mt-4 mb-8">
            <div className="mt-4 mb-8 text-[31px] font-medium">
              Awesome Features
            </div>
            <div className="text-[16px] flex flex-row justify-center">
              <div className="md:w-3/5">
                Your homepage is accessible to all who visit your website. This
                page is great for sharing information you would like everyone to
                see.
              </div>
            </div>
          </div>
          <div className="pb-12 border-b border-gray-100">
            <div className="grid items-center grid-cols-1 mt-12 gap-x-4 gap-y-8 lg:grid-cols-3 overflow-wrap">
              <div className="flex flex-col items-center justify-center col-span-1">
                <div className="flex flex-col items-center justify-center p-2 mb-4 border border-gray-100 rounded-lg shadow-sm bg-gray-50">
                  <SparklesIcon
                    className="w-8 h-8 text-indigo-500"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-[24px] font-semibold">Feature Rich</h3>
                <p className="text-[16px]">
                  This Homepage is sparkling for your delight
                </p>
              </div>
              <div className="flex flex-col items-center justify-center col-span-1">
                <div className="flex flex-col items-center justify-center p-2 mb-4 border border-gray-100 rounded-lg shadow-sm bg-gray-50">
                  <ShieldCheckIcon
                    className="w-8 h-8 text-indigo-500"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-[24px] font-semibold">Secure</h3>
                <p className="text-[16px]">This Homepage is secure</p>
              </div>
              <div className="flex flex-col items-center justify-center col-span-1">
                <div className="flex flex-col items-center justify-center p-2 mb-4 border border-gray-100 rounded-lg shadow-sm bg-gray-50">
                  <LightBulbIcon
                    className="w-8 h-8 text-indigo-500"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-[24px] font-semibold">New Ideas</h3>
                <p className="text-[16px]">This homepage is full of ideas</p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-start">
            <h2 className="text-[31px] font-semibold">
              Guard Your Sensitive Content
            </h2>
            <p className="text-[16px] mt-2 mb-4">
              Share updates with your community on token gated pages. Upcoming
              Events and Contact Us are only accessible to members. The Admin
              page is only accessible and editable by admins.
            </p>
            <WhiteButton onClick={() => console.log('clicked')}>
              <div className="inline-flex items-center">
                Learn more
                <ArrowRightIcon className="w-3 h-3 ml-1.5" strokeWidth={3} />
              </div>
            </WhiteButton>
          </div>
        </main>
      </ContentLayout>
    </>
  );
};

export default Home;

import '@fontsource/space-grotesk/700.css';
import { createFileRoute } from '@tanstack/react-router';
import headerMotionUrlCapture from '../../assets/header-motion-capture.png';
import headerMotionUrl from '../../assets/header-motion.mp4';
import { AllContent } from '../../modules/home/AllContent.tsx';

export const Route = createFileRoute('/_index/')({
  component: Home,
});

function Home() {
  return (
    <>
      <div className="relative flex h-[300px] max-w-7xl items-center justify-center text-center lg:h-[330px] xl:h-[360px]">
        <img
          src={headerMotionUrlCapture}
          className="absolute z-0 h-full w-full rounded-3xl object-cover md:hidden"
        />
        <video
          autoPlay
          muted
          loop
          className="absolute z-0 hidden h-full w-full rounded-3xl object-cover md:block"
        >
          <source src={headerMotionUrl} type="video/mp4" />
        </video>
      </div>

      <div className="mt-10 sm:mt-20">
        <div className="text-[#D9D9D9]">Welcome All The Bookworms To📚🐛</div>
        <h1 className="mt-1 text-balance font-anybody text-2xl font-[750] sm:text-5xl">
          LibraNova: The Web3 Digital Boostore
        </h1>
        <AllContent />
      </div>
    </>
  );
}

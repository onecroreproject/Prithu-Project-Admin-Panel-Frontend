import React from "react";
import GridShape from "../../components/common/GridShape";
import PrithuLogo from "../../Assets/Logo/PrithuLogo.png";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({ children }) {
  return (
    <>
      <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
          {children}

          <div className="items-center hidden w-full h-full lg:w-1/2 bg-white dark:bg-white/5 lg:grid">
            <div className="relative flex items-center justify-center z-1">
              {/* ===== Common Grid Shape Start ===== */}
              <GridShape />

              <div className="flex flex-col items-center max-w-xs">
                {/* Logo with spin animation */}
                <div className="block mb-4">
                  <img
                    width={231}
                    height={48}
                    src={PrithuLogo}
                    alt="Logo"
                    className="logo-spin"
                  />
                </div>

                {/* Animated slogan */}
                <p className="text-center text-gray-400 dark:text-white/60 slogan">
                  <span>Feel</span> <span>It.</span> <span>Share</span>{" "}
                  <span>It.</span> <span>Heal</span> <span>Together</span>
                </p>
              </div>
            </div>
          </div>
          
<div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
        /* Logo rotation */
        @keyframes logoSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .logo-spin {
          animation: logoSpin 1s ease-in-out 1;
        }

        /* Slogan word scaling */
        .slogan span {
          display: inline-block;
          animation: wordScale 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0.95;
          transform-origin: center;
          will-change: transform, color;
        }
        .slogan span:nth-child(1) { animation-delay: 0s; }
        .slogan span:nth-child(2) { animation-delay: 0.2s; }
        .slogan span:nth-child(3) { animation-delay: 0.4s; }
        .slogan span:nth-child(4) { animation-delay: 0.6s; }
        .slogan span:nth-child(5) { animation-delay: 0.8s; }
        .slogan span:nth-child(6) { animation-delay: 1s; }

        @keyframes wordScale {
          0% { transform: scale(1); color: #9ca3af; }   /* gray-400 */
          50% { transform: scale(1.15); color: #1f2937; } /* gray-800 */
          100% { transform: scale(1); color: #9ca3af; }  /* gray-400 */
        }
        `}
      </style>
    </>
  );
}





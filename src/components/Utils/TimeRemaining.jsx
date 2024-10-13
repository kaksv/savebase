import { useCallback, useEffect, useState } from "react";
const Timer3 = ({ timeH }) => {
  // console.log("fff :",Math.floor(timeH/1e6))
  // let timeR = ((Math.floor(timeH/1e6)) - new Date().getTime* 1e3)/1e3
  // console.log(timeR);

  let dd =
    Math.floor(Number(timeH) / 1e9) - Math.floor(new Date().getTime() / 1e3);

  const [countDownTime, setCountDownTIme] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const getTimeDifference = (countDownTime) => {
    const currentTime = new Date().getTime();
    const timeDiffrence = countDownTime - currentTime;
    let days =
      Math.floor(timeDiffrence / (24 * 60 * 60 * 1000)) >= 10
        ? Math.floor(timeDiffrence / (24 * 60 * 60 * 1000))
        : `0${Math.floor(timeDiffrence / (24 * 60 * 60 * 1000))}`;
    const hours =
      Math.floor((timeDiffrence % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)) >=
      10
        ? Math.floor((timeDiffrence % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60))
        : `0${Math.floor(
            (timeDiffrence % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
          )}`;
    const minutes =
      Math.floor((timeDiffrence % (60 * 60 * 1000)) / (1000 * 60)) >= 10
        ? Math.floor((timeDiffrence % (60 * 60 * 1000)) / (1000 * 60))
        : `0${Math.floor((timeDiffrence % (60 * 60 * 1000)) / (1000 * 60))}`;
    const seconds =
      Math.floor((timeDiffrence % (60 * 1000)) / 1000) >= 10
        ? Math.floor((timeDiffrence % (60 * 1000)) / 1000)
        : `0${Math.floor((timeDiffrence % (60 * 1000)) / 1000)}`;
    if (timeDiffrence < 0) {
      setCountDownTIme({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      });
      clearInterval();
    } else {
      setCountDownTIme({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      });
    }
  };
  const startCountDown = useCallback(() => {
    const customDate = new Date();
    const countDownDate = new Date(
      customDate.getFullYear(),
      customDate.getMonth(),
      customDate.getDate(),
      customDate.getHours(),
      customDate.getMinutes(),
      customDate.getSeconds() + dd
    );
    setInterval(() => {
      getTimeDifference(countDownDate.getTime());
    }, 1000);
  }, []);
  useEffect(() => {
    startCountDown();
  }, [startCountDown]);
  return (
    <div className="flex mt-4 items-center gap-6 justify-center mb-8">
      <div className="flex flex-col  relative">
        <div className="h-6 w-6 flex justify-between items-center rounded-lg">
          <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 !-left-[6px] rounded-full"></div>
          <div className="flex flex-col justify-center items-center">
            <span className="text-xs mt-1 font-semibold text-white">
              {countDownTime?.days}
            </span>
            <span className="text-[8px] text-white font-bold">Days</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 relative">
        <div className="h-6 w-6 flex justify-between items-center rounded-lg">
          <div className="flex flex-col justify-center items-center">
            <span className="text-xs mt-1 font-semibold text-white">
              {countDownTime?.hours}
            </span>
            <span className="text-[8px] text-white font-bold">hrs</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 relative">
        <div className="h-6 w-6 flex justify-between items-center rounded-lg">
          <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 !-left-[6px] rounded-full"></div>

          <div className="flex flex-col justify-center items-center">
            <span className="text-xs mt-1 font-semibold text-white">
              {countDownTime?.minutes}
            </span>
            <span className="text-[8px] text-white font-bold">mins</span>
          </div>

          {/* <span>:</span> */}
        </div>
      </div>
      <div className="flex flex-col relative">
        <div className="h-6 w-6 flex justify-between items-center rounded-lg">
          <div className="flex flex-col justify-center items-center">
            <span className="text-xs mt-1 font-semibold text-white">
              {countDownTime?.seconds}
            </span>

            <span className="text-[8px] text-white font-bold">sec</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Timer3;

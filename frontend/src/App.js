/** @jsx jsx */
import { useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import Cookies from "js-cookie";

import accountIcon from "./icons/account-white.svg";

import PrimaryTicker from "./components/PrimaryTicker";
import Chart from "./components/Chart";
import SearchField from "./components/SearchField";
import Watchlist from "./components/Watchlist";
import Newslist from "./components/Newslist";
import SignOut from "./components/modals/SignOut";
import Authenticate from "./components/modals/Authenticate";
import { updateWatchlist } from "./lib/utils";
import { theme } from "./theme";

const { colors } = theme;

const sidebar = css`
  background: ${colors.gray200};
`;

const account = css`
  width: 50px;
  height: 50px;
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
`;

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function App() {
  const [priceData, setpriceData] = useState({});
  const [newslist, setNewslist] = useState([]);
  const [primaryTicker, setPrimaryTicker] = useState("AAPL");
  const [watchlist, setWatchlist] = useState([]);
  const [bottomState, setBottomState] = useState(true);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const user = Cookies.get("user");

  useEffect(() => {
    const HTTP_OK = 200;
    const fetchData = async () => {
      let response = await fetch(
        `http://localhost:6969/quote/${primaryTicker}`
      );
      if (response.status === HTTP_OK) {
        let json = await response.json();
        setpriceData(json);
      } else {
        alert(`error: ${response.status}`);
      }
    };
    fetchData();
  }, [primaryTicker]);

  useEffect(() => {
    const HTTP_OK = 200;
    const fetchNewslist = async () => {
      let response = await fetch(`http://localhost:6969/news/${primaryTicker}`);
      if (response.status === HTTP_OK) {
        let json = await response.json();
        setNewslist(json);
      } else {
        alert(`error: ${response.status}`);
      }
    };
    fetchNewslist();
  }, [primaryTicker]);

  const handleWatchlist = function () {
    setBottomState(true);
    if (priceData.c) {
      updateWatchlist(watchlist, setWatchlist, primaryTicker, priceData);
    }
  };

  return (
    <div className="flex flex-wrap">
      <SignOut showDialog={showSignOut} setShowDialog={setShowSignOut} />
      <Authenticate showDialog={showAuth} setShowDialog={setShowAuth} />
      {user ? (
        <div css={account} onClick={() => setShowSignOut(true)}>
          <img src={accountIcon} />
        </div>
      ) : (
        <div css={account} onClick={() => setShowAuth(true)}>
          <button onClick={() => setShowAuth(true)}>Sign In</button>
        </div>
      )}
      <div
        className="w-full lg:w-3/12 xl:w-2/12 lg:h-screen py-5 px-2 shadow-md"
        css={sidebar}
      >
        <SearchField setPrimaryTicker={setPrimaryTicker} />
        <Watchlist watchlist={watchlist} setWatchlist={setWatchlist} />
      </div>
      <div className="flex flex-col items-center w-full lg:w-9/12 xl:w-10/12 h-12 p-5">
        <PrimaryTicker
          priceData={priceData}
          primaryTicker={primaryTicker}
          setBottomState={setBottomState}
          watchlist={watchlist}
          setWatchlist={setWatchlist}
        />
        <Chart data={data} />
        <Newslist newslist={newslist} />
      </div>
    </div>
  );
}

export default App;

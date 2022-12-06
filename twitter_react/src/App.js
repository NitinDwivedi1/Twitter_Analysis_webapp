// Importing modules
import React, { useState, useEffect } from "react";
import "./App.css";
import Analysis from "./Analysis";
import { accordion, Button } from "@material-tailwind/react";
import Navbar1 from "./Navbar1";
import { Input } from "@material-tailwind/react";
import { MDBContainer, MDBBtn } from "mdb-react-ui-kit";
import useToken from "./useToken";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import label from "./images/label.jpeg";

function App() {
  // usestate for setting a javascript
  // object for storing and using data
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [data, setdata] = useState({
    keyword: "",
    sentiment_score: {},
    sentiment_score_image: "",
    wordcloud_image: "",
    locs: {},
    locations_image: "",
    hashtags: {},
    mentioned_users: {},
    mentions_image: "",
    hashtags_image: "",
    words: {},
    words_image: "",
    bigrams: {},
    bigrams_image: "",
  });

  const [sentiment_score_updated, setsentiment_score_updated] = useState([]);
  const [locs_updated, setlocs_updated] = useState([]);
  const [hashtags_updated, sethashtags_updated] = useState([]);
  const [bigrams_updated, setbigrams_updated] = useState([]);
  const [mentioned_users_updated, setmentioned_users_updated] = useState([]);
  const [words_updated, setwords_updated] = useState([]);
  const [accordion, setAccordian] = useState(false);

  useEffect(() => {
    const data1 = Object.keys(data.sentiment_score).map(function (key) {
      return [String(key), data.sentiment_score[key]];
    });

    console.log(data1);
    setsentiment_score_updated(data1);
  }, [data]);

  useEffect(() => {
    const data2 = Object.keys(data.locs).map(function (key) {
      return [String(key), data.locs[key]];
    });

    console.log(data2);
    setlocs_updated(data2);
  }, [data]);

  useEffect(() => {
    const data3 = Object.keys(data.hashtags).map(function (key) {
      return [String(key), data.hashtags[key]];
    });

    console.log(data3);
    sethashtags_updated(data3);
  }, [data]);

  useEffect(() => {
    const data4 = Object.keys(data.mentioned_users).map(function (key) {
      return [String(key), data.mentioned_users[key]];
    });

    console.log(data4);
    setmentioned_users_updated(data4);
  }, [data]);

  useEffect(() => {
    const data5 = Object.keys(data.words).map(function (key) {
      return [String(key), data.words[key]];
    });

    console.log(data5);
    setwords_updated(data5);
  }, [data]);

  useEffect(() => {
    const data6 = Object.keys(data.bigrams).map(function (key) {
      return [String(key), data.bigrams[key]];
    });

    console.log(data6);
    setbigrams_updated(data6);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setdata({ ...data, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    if (data.keyword == "") {
      toast.error("Please enter keyword");
      return;
    }
    setLoading(true);
    const response = await fetch("/plot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyword: data.keyword,
      }),
    });
    console.log("res==", response);
    const json = await response.json();
    console.log("json " + JSON.stringify(json));
    console.log(response.ok);
    if (response.ok) {
      setdata(json);
      setLoading(false);
    } else {
      setLoading(false);
    }
    // fetchProducts()
  };
  console.log("dataaaaaaaaaa" + data);
  const Print = () => {
    console.log("print");
    let printContents = document.getElementById("printablediv").innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  if (token == null) return <Navigate to="/register" />;
  return (
    <>
      <MDBContainer>
        <ToastContainer />
        {/* <header><Navigationbar/></header>    */}
        <div className="flex justify-center ">
          <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
            <form onSubmit={handleSubmit}>
              <div class="form-group mb-2">
                <label
                  for="exampleInputEmail1"
                  class="form-label inline-block mb-2 text-gray-700"
                >
                  Keyword
                </label>
                <input
                  class="form-control
        block
        w-full
        px-3
      
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  type="text"
                  name="keyword"
                  // className="w-3"
                  value={data.keyword}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                class="
      px-6
      py-2.5
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
              >
                Analyse
              </button>
            </form>
          </div>
        </div>
        {/* <h3>{data?.keyword}</h3> */}
        <br></br>
        <div class="my-3 accordion" id="accordionExample">
          <div class="accordion-item bg-white border border-gray-200">
            <h2 class="accordion-header mb-0" id="headingOne">
              <button
                onClick={() => setAccordian(!accordion)}
                class="
        accordion-button
        relative
        flex
        items-center
        w-full
        py-4
        px-5
        text-base text-gray-800 text-left
        bg-white
        border-0
        rounded-none
        transition
        focus:outline-none
      "
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Description
              </button>
            </h2>
            <div
              id="collapseOne"
              class={`accordion-collapse  ${
                accordion ? `show` : `collapse hide`
              }`}
              aria-labelledby="headigOne"
              data-bs-parent="#accorionExample"
            >
              <div class="accordion-bod py-4 px-5">
                <pre
                  style={{ zIndex: 100 }}
                >{`Description: To get analysis report about any topic on twitter:
          Enter keyword for that topic and we will fetch most recent tweets containing that keyword and perform analysis report on it with following points: 
          1. Sentiment Score i.e. positive, negative or neutral tweets counts with visualization.
          2. WordCloud Image
          3. Top Locations of tweets with visualization
          4. Top mentioned users with visualization
          5. Most occuring words with visualization
          6. Most occuring bigrams (i.e. set of two words) with visualization 
          Go to "About" section for more!`}</pre>
              </div>
            </div>
          </div>
        </div>
        <div style={{width:"15%"}}>
          <img src={label} />
        </div>
        {loading ? (
          <div>
            <Loader />
          </div>
        ) : (
          ""
        )}
        <div id="printablediv">
          <Analysis
            data1={data}
            words_updated1={words_updated}
            bigrams_updated1={bigrams_updated}
            mentioned_users_updated1={mentioned_users_updated}
            sentiment_score_updated1={sentiment_score_updated}
            hashtags_updated1={hashtags_updated}
            locs_updated1={locs_updated}
          />
        </div>
        {/* <h3>{data?.sentiment_score}</h3> */}
        <div className="flex justify-center">
          <MDBBtn onClick={Print}>Print Analysis</MDBBtn>
        </div>
      </MDBContainer>
    </>
  );
}

export default App;

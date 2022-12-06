import { Navigate } from "react-router-dom";
import React, { useState } from "react";
import Bigrams from "./images/bigrams.jpg";
import Hastags from "./images/hashtags.jpg";
import keyword from "./images/keyword.jpg";
import locations from "./images/locations.jpg";
import user from "./images/users.jpg";
import WordCloud from "./images/wordcloud.png";
import words from "./images/words.jpg";
import sentiment_score from "./images/sentiment_score.jpg";

export default function About() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [images, setImages] = useState([
    Bigrams,
    Hastags,
    keyword,
    locations,
    user,
    WordCloud,
    words,
    sentiment_score,
  ]);

  if (token == null) return <Navigate to="/register" replace />;
  return (
    <>
      <div className="container h-50 mx-9">
        <div class="p-6 mx-6 shadow-lg rounded-lg bg-gray-100 text-gray-700">
          <h2 class="font-semibold text-3xl mb-5">About Twitter Analysis!</h2>

          <pre>{`
        TWITTER ANALYSIS analyzes any hot opic trending on twitter to get insights of it!
        To get analysis report about any topic on twitter:
        Enter keyword for that topic and we will fetch most recent tweets containing that keyword and perform analysis report on it with following points: 
        1. Sentiment Score i.e. positive, negative or neutral tweets counts with visualization.
            2. WordCloud Image
            3. Top Locations of tweets with visualization
            4. Top mentioned users with visualization
            5. Most occuring words with visualization
            6. Most occuring bigrams (i.e. set of two words) with visualization `}</pre>
          {images.map((item) => (
            <div>
              <img src={item} />
            </div>
          ))}
        </div>
        <br />
        <br />
      </div>
    </>
  );
}

import React, { useState, useEffect } from "react";
import axios from "./axios";
import requests from "./requests";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);

  const [trailerUrl, setTrailerUrl] = useState("");

  //use effect runs based on a specific condition
  //load movies when the row is loaded
  //if the [] run once when the row loads,and dont run again
  //if you are getting data from a third party app use ASYNC because it takes time to load data
  useEffect(() => {
    async function fetchData() {
      //await is wait for the promise(answer) to comeback
      const request = await axios.get(fetchUrl);
      //   console.log(request); //check to see if you are getting result
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]); //whenever you use any variable which is pulled outside in use effect you have to include in here because it's dependent

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl(""); //if the trailer is already playing then close it
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row_posters">
        {movies.map((movie) => (
          <img
            // if anything changes then rerender so that react can be faster
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;

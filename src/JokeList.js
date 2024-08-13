import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({numJokesToGet = 5}){
  const [jokes, setJokes] = useState([]);
  const [{isLoading,setIsLoading}]= useState([true])

  useEffect(()=>{
    async function getJokes(){
      let joke = [...jokes]
      let seenJokes = new Set();
      try {
        while (joke.length < numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { ...resObj } = res.data;
  
          if (!seenJokes.has(resObj.id)) {
            seenJokes.add(resObj.id);
            joke.push({ ...resObj, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }
        setJokes(joke)
        setIsLoading(false)
      } catch (err) {
        console.error(err);
      }
    }

    if(jokes.length === 0) getJokes();
    }, [jokes, numJokesToGet]);


  /* empty joke list, set to loading state, and then call getJokes */

  function generateNewJokes() {
    setJokes([]);
    setIsLoading(true)
  }

  /* change vote for this id by delta (+1 or -1) */
  function vote(id,delta){
    setJokes(allJokes => allJokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j))
    };
  

  /* render: either loading spinner or list of sorted jokes. */

  if(isLoading){
      return (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      )
    }

    let sortedJokes = [...jokes].sort((a,b)=> b.votes - a.votes);
    
    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(j => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={vote}
          />
        ))}
      </div>
    );
  }
  

export default JokeList;

import React, { useState } from "react";
import "./App.css";

function App() {
  const [response, setResponse] = useState("");

  //Pokemonset made variable incase we wanted to look at different sets in the future
  const pokemonSet = 4;

  async function createBackup() {
    const cardData = await fetch(
      `https://api.pokemontcg.io/v1/cards?setCode=base${pokemonSet}`
    ).then((res) => res.json());
    console.log(cardData);
    setResponse("Backup created");
  }

  function purgeBackup() {
    setResponse("Backup deleted");
  }

  return (
    <div className="App">
      <h2>Pokemon Set {pokemonSet}</h2>

      <button
        onClick={() => {
          createBackup();
        }}
      >
        Create backup
      </button>
      <button
        onClick={() => {
          purgeBackup();
        }}
      >
        Purge Backup
      </button>
      <button>Search backup</button>
      <div>{response}</div>
    </div>
  );
}

export default App;

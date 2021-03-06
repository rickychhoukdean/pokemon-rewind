import React, { useState } from "react";
import "./App.css";
import Search from "./components/Search";

function App() {
  const [response, setResponse] = useState("");

  //Pokemonset made variable incase we wanted to look at different sets in the future
  const pokemonSet = 4;

  async function createBackup() {
    const cardData = await fetch(
      `https://api.pokemontcg.io/v1/cards?setCode=base${pokemonSet}`
    ).then((res) => res.json());

    fetch(`/api/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setResponse(data.error);
        } else {
          setResponse("Backup created");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function purgeBackup() {
    fetch(`/api/cards`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setResponse(data.error);
        } else {
          setResponse("Backup deleted");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function searchBackup() {
    return setResponse(<Search />);
  }

  return (
    <div className="App">
      <h2>Pokemon Set {pokemonSet} Backup</h2>

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
      <button
        onClick={() => {
          searchBackup();
        }}
      >
        Search backup
      </button>

      <div className="response">{response}</div>
    </div>
  );
}

export default App;

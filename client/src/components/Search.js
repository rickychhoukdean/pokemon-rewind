import React, { useState } from "react";
import SearchResult from "./SearchResult";
import "../App.css";

function Search() {
  const [name, setName] = useState("");
  const [rarity, setRarity] = useState("");
  const [hitpoint, setHitpoint] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  const handleRareChange = (event) => {
    setRarity(event.target.value);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleHitpointChange = (event) => {
    setHitpoint(event.target.value);
  };

  function searchCards(event) {
    event.preventDefault();

    fetch(`/api/cards/?name=${name}&rarity=${rarity}&hitpoint=${hitpoint}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setResult([]);
          setError(data.error);
        } else {
          if (data.length) {
            setResult(data);
            setError("");
          } else {
            setResult([]);
            setError("No cards matched these queries");
          }
        }
      });
  }

  return (
    <section>
      <form className="form" onSubmit={searchCards}>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleNameChange}
          />
        </label>
        <label htmlFor="rarity">
          Rarity:
          <select
            name="rarity"
            id="rarity"
            onChange={handleRareChange}
            value={rarity}
          >
            <option value="">Any</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
          </select>
        </label>
        <label htmlFor="hitpoints">
          Hitpoints:
          <input
            type="number"
            name="hitpoints"
            value={hitpoint}
            onChange={handleHitpointChange}
          />
        </label>
        <input type="submit" value="Submit" />,
      </form>
      <SearchResult result={result} />
      <div className="response">{error}</div>
    </section>
  );
}

export default Search;

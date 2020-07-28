import React, { useState } from "react";
import SearchResult from "./SearchResult";

function Search() {
  const [name, setName] = useState("");
  const [rarity, setRarity] = useState("");
  const [hitpoint, setHitpoint] = useState("");
  const [result, setResult] = useState([]);

  const handleRareChange = (event) => {
    setRarity(event.target.value);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleHitpointChange = (event) => {
    setHitpoint(event.target.value);
  };

  async function searchCards(event) {
    event.preventDefault();

    const cardData = await fetch(
      `/api/cards/?name=${name}&rarity=${rarity}&hitpoint=${hitpoint}`
    ).then((res) => res.json());

    console.log(cardData);
    setResult(cardData);
  }

  return (
    <section>
      <form onSubmit={searchCards}>
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
            <option value="">any</option>
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
    </section>
  );
}

export default Search;

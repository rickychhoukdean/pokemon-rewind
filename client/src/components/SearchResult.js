import React from "react";

function SearchResult({ result }) {
  const res = result.map((result, index) => (
    <img key={index} src={result.imageUrl} alt={result.name} />
  ));

  return <>{res}</>;
}

export default SearchResult;

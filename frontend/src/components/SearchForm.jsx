import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Import your Axios instance
import { toast } from "react-toastify";

function SearchForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!query.trim()) {
      toast.info("Please enter a search term.");
      return;
    }
    try {
        console.log("query:  ",query)
      const response = await api.get(`/api/books/search/?q=${query}`);
      setResults(response.data);
      navigate(`/search?q=${query}`, { state: { results: response.data } });
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <form className="d-flex" onSubmit={handleSearch}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search for books"
        aria-label="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-outline-success" type="submit">
        Search
      </button>
    </form>
  );
}

export default SearchForm;

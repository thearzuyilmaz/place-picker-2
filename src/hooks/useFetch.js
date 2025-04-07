import { useState, useEffect } from 'react';


export function useFetch(fetchFunction, initialValue) {

    const [data, setData] = useState(initialValue);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);

    // Sayfa yüklendiğinde sunucudan yerleri getir
  useEffect(() => {
    async function loadData() {
      setIsFetching(true);
      try {
        const places = await fetchFunction();
        console.log("Fetched user places:", places); 
        setData(places);
      } catch (error) {
        setError({message: error.message || "Failed to fetch data"});
      }
      setIsFetching(false);
    }

    loadData(); 
  }, [fetchFunction]); // Add fetchFunction as a dependency

  return {
    data,
    setData,
    isFetching,
    error,
  }
}
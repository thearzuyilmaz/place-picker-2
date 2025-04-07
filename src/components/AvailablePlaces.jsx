import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { fetchAvailablePlaces } from "../http.js";
import { useFetch } from "../hooks/useFetch.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    data: availablePlaces,
    isFetching,
    error,
  } = useFetch(fetchAvailablePlaces, []);

  if (error) {
    return <ErrorPage title="Error occured" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}

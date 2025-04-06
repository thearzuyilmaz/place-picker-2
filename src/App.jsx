import { useRef, useState, useCallback } from "react";
import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import { useEffect } from "react";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { updateUserPlaces, fetchUserPlaces } from "./http.js";
import ErrorPage from "./components/ErrorPage.jsx";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Sayfa yüklendiğinde sunucudan yerleri getir
  useEffect(() => {
    async function loadUserPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchUserPlaces();
        console.log("Fetched user places:", places); // API cevabını kontrol et

        setUserPlaces(places);
      } catch (error) {
        setError({message: error.message || "Failed to fetch user places"});
      }
      setIsFetching(false);
    }

    loadUserPlaces(); // call loading data
  }, []); // Boş dependency array, bu effect'in sadece bir kez çalışmasını sağlar

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    if (userPlaces.some((place) => place.id === selectedPlace.id)) {
      return;
    } // Already added, no need to process

    // Create the updated list
    const updatedPlaces = [selectedPlace, ...userPlaces];

    // Update local state first
    setUserPlaces(updatedPlaces);

    // Update the server with error handling
    try {
      await updateUserPlaces(updatedPlaces);
      // Continue here after server update completes
      console.log("Place successfully added!");
    } catch (error) {
      console.error("Error updating places on server:", error);
      // Revert the local state since server update failed
      setUserPlaces(userPlaces);
      // Could add user notification here
    }
  }

  // Yer silme işlemini güncelleyin
  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      try {
        // Silme işleminden sonra güncellenmiş listeyi sunucuya gönder
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (error) {
        setUserPlaces(userPlaces);
        console.log("Error removing places from server");
      }

      setModalIsOpen(false);
    },
    [userPlaces]
  );

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <ErrorPage title="An error occured!" message={error.message} />}
        {!error && (
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
          isLoading={isFetching}
          loadingText="Fetching your places..."
        />)}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;

import { setOrigin, setDestionation } from "../store/navSlice";

export const fetchData = (dispatch, originStop, destinationStop) => {
  try {
    dispatch(
      setOrigin({
        location: {
          latitude: originStop.latitude,
          longitude: originStop.longitude,
        },
        details: { id: originStop.id, name: originStop.name },
      })
    );
    dispatch(
      setDestionation({
        location: {
          latitude: destinationStop.latitude,
          longitude: destinationStop.longitude,
        },
        details: { id: destinationStop.id, name: destinationStop.name },
      })
    );
  } catch (error) {
    console.error("Błąd podczas aktualizacji danych:", error);
  }
};

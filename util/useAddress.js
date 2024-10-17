import { useState, useEffect } from "react";
import * as Location from "expo-location";

const useAddress = (latitude, longitude) => {
  const [address, setAddress] = useState("");

  // Get the address from the latitude and longitude
  useEffect(() => {
    (async () => {
      if (!latitude || !longitude) {
        setAddress("");
        return;
      }

      // Ensure you have permission to use location services
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let results = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (results.length > 0) {
        const firstResult = results[0];
        const addressParts = [];

        // Include more specific parts of the address if they exist
        if (firstResult.name) {
          addressParts.push(firstResult.name);
        } else if (firstResult.street) {
          addressParts.push(firstResult.street);
        }
        // if (firstResult.street) addressParts.push(firstResult.street);
        if (firstResult.city) addressParts.push(firstResult.city);
        if (firstResult.region) addressParts.push(firstResult.region);
        // if (firstResult.postalCode) addressParts.push(firstResult.postalCode);
        if (firstResult.country) addressParts.push(firstResult.country);

        // Join the parts with commas to form a full address string
        let readableAddress = addressParts.join(", ");
        setAddress(readableAddress);
      }
    })();
  }, [latitude, longitude]);

  return address;
};

export default useAddress;

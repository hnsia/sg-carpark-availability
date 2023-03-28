import { useState, useEffect } from "react";
import useInterval from "./useInterval";

const useCarparkAPI = () => {
  const url = "https://api.data.gov.sg/v1/transport/carpark-availability";
  const [data, setData] = useState(null);

  const fetchData = () => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(analyzeCarparks(data.items[0].carpark_data));
      });
  };

  useEffect(fetchData, []);
  useEffect(() => {
    console.log(`Fetching data at ${new Date()}`);
    console.log(data);
  }, [data]);
  useInterval(fetchData, 60000);

  return data;
};

const analyzeCarparks = (carparkData) => {
  const transformedData = carparkData.map((data) => {
    const totalLots = data.carpark_info.reduce((acc, curr) => {
      return acc + Number(curr.total_lots);
    }, 0);

    const lotsAvailable = data.carpark_info.reduce((acc, curr) => {
      return acc + Number(curr.lots_available);
    }, 0);

    let category;

    if (totalLots < 100) {
      category = "Small";
    } else if (totalLots >= 100 && totalLots < 300) {
      category = "Medium";
    } else if (totalLots >= 300 && totalLots < 400) {
      category = "Big";
    } else {
      category = "Large";
    }

    return {
      carparkNumber: data.carpark_number,
      totalLots: totalLots,
      lotsAvailable: lotsAvailable,
      carparkCategory: category,
    };
  });

  const carparkGroupedByCategory = transformedData.reduce((groups, carpark) => {
    groups[carpark.carparkCategory] = groups[carpark.carparkCategory] ?? [];
    groups[carpark.carparkCategory].push(carpark);
    return groups;
  }, {});

  const result = [];
  Object.keys(carparkGroupedByCategory).forEach((category) => {
    const carparkHighest = Math.max(
      ...carparkGroupedByCategory[category].map(
        (carpark) => carpark.lotsAvailable
      )
    );
    const carparkLowest = Math.min(
      ...carparkGroupedByCategory[category].map(
        (carpark) => carpark.lotsAvailable
      )
    );
    const listOfCarparkWithHighestAvailability = carparkGroupedByCategory[
      category
    ].filter((carpark) => carpark.lotsAvailable === carparkHighest);
    const listOfCarparkWithLowestAvailability = carparkGroupedByCategory[
      category
    ].filter((carpark) => carpark.lotsAvailable === carparkLowest);

    result.push({
      category: category,
      highestNumberOfLots: carparkHighest,
      listOfCarparksWithHighestAvailability:
        listOfCarparkWithHighestAvailability.map(
          (carpark) => carpark.carparkNumber
        ),
      lowestNumberOfLots: carparkLowest,
      listOfCarparksWithLowestAvailability:
        listOfCarparkWithLowestAvailability.map(
          (carpark) => carpark.carparkNumber
        ),
    });
  });

  return result;
};

export default useCarparkAPI;

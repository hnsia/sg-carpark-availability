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

    console.log(`Fetching data at ${new Date()}`);
    console.log(data);
  };

  useEffect(fetchData, []);
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

  const smallCarparkHighest = Math.max(
    ...carparkGroupedByCategory["Small"].map((carpark) => carpark.lotsAvailable)
  );
  const smallCarparkLowest = Math.min(
    ...carparkGroupedByCategory["Small"].map((carpark) => carpark.lotsAvailable)
  );
  const listOfSmallCarparkWithHighestAvailability = carparkGroupedByCategory[
    "Small"
  ].filter((carpark) => carpark.lotsAvailable === smallCarparkHighest);
  const listOfSmallCarparkWithLowestAvailability = carparkGroupedByCategory[
    "Small"
  ].filter((carpark) => carpark.lotsAvailable === smallCarparkLowest);

  const mediumCarparkHighest = Math.max(
    ...carparkGroupedByCategory["Medium"].map(
      (carpark) => carpark.lotsAvailable
    )
  );
  const mediumCarparkLowest = Math.min(
    ...carparkGroupedByCategory["Medium"].map(
      (carpark) => carpark.lotsAvailable
    )
  );
  const listOfMediumCarparkWithHighestAvailability = carparkGroupedByCategory[
    "Medium"
  ].filter((carpark) => carpark.lotsAvailable === mediumCarparkHighest);
  const listOfMediumCarparkWithLowestAvailability = carparkGroupedByCategory[
    "Medium"
  ].filter((carpark) => carpark.lotsAvailable === mediumCarparkLowest);

  const bigCarparkHighest = Math.max(
    ...carparkGroupedByCategory["Big"].map((carpark) => carpark.lotsAvailable)
  );
  const bigCarparkLowest = Math.min(
    ...carparkGroupedByCategory["Big"].map((carpark) => carpark.lotsAvailable)
  );
  const listOfBigCarparkWithHighestAvailability = carparkGroupedByCategory[
    "Big"
  ].filter((carpark) => carpark.lotsAvailable === bigCarparkHighest);
  const listOfBigCarparkWithLowestAvailability = carparkGroupedByCategory[
    "Big"
  ].filter((carpark) => carpark.lotsAvailable === bigCarparkLowest);

  const largeCarparkHighest = Math.max(
    ...carparkGroupedByCategory["Large"].map((carpark) => carpark.lotsAvailable)
  );
  const largeCarparkLowest = Math.min(
    ...carparkGroupedByCategory["Large"].map((carpark) => carpark.lotsAvailable)
  );
  const listOfLargeCarparkWithHighestAvailability = carparkGroupedByCategory[
    "Large"
  ].filter((carpark) => carpark.lotsAvailable === largeCarparkHighest);
  const listOfLargeCarparkWithLowestAvailability = carparkGroupedByCategory[
    "Large"
  ].filter((carpark) => carpark.lotsAvailable === largeCarparkLowest);

  return [
    {
      category: "Small",
      highestNumberOfLots: smallCarparkHighest,
      listOfCarparksWithHighestAvailability:
        listOfSmallCarparkWithHighestAvailability.map(
          (carpark) => carpark.carparkNumber
        ),
      lowestNumberOfLots: smallCarparkLowest,
      listOfCarparksWithLowestAvailability:
        listOfSmallCarparkWithLowestAvailability.map(
          (carpark) => carpark.carparkNumber
        ),
    },
    {
      category: "Medium",
      highestNumberOfLots: mediumCarparkHighest,
      listOfCarparksWithHighestAvailability:
        listOfMediumCarparkWithHighestAvailability.map(
          (carpark) => carpark.carparkNumber
        ),
      lowestNumberOfLots: mediumCarparkLowest,
      listOfCarparksWithLowestAvailability:
        listOfMediumCarparkWithLowestAvailability.map(
          (carpark) => carpark.carparkNumber
        ),
    },
    {
      category: "Big",
      highestNumberOfLots: bigCarparkHighest,
      listOfCarparksWithHighestAvailability:
        listOfBigCarparkWithHighestAvailability.map(
          (carpark) => carpark.carparkNumber
        ),
      lowestNumberOfLots: bigCarparkLowest,
      listOfCarparksWithLowestAvailability:
        listOfBigCarparkWithLowestAvailability.map(
          (carpark) => carpark.carparkNumber
        ),
    },
    {
      category: "Large",
      highestNumberOfLots: largeCarparkHighest,
      listOfCarparksWithHighestAvailability:
        listOfLargeCarparkWithHighestAvailability.map(
          (carpark) => carpark.carparkNumber
        ),
      lowestNumberOfLots: largeCarparkLowest,
      listOfCarparksWithLowestAvailability:
        listOfLargeCarparkWithLowestAvailability.map(
          (carpark) => carpark.carparkNumber
        ),
    },
  ];

  //   const smallCarparkHighest = carparkGroupedByCategory["Small"].reduce((maxCarpark, carpark) => {
  //     return maxCarpark.lotsAvailable > carpark.lotsAvailable ? maxCarpark : carpark;
  //   })

  //   const smallCarparkLowest = carparkGroupedByCategory["Small"].reduce((minCarpark, carpark) => {
  //     return minCarpark.lotsAvailable < carpark.lotsAvailable ? minCarpark : carpark;
  //   })

  //   const mediumCarparkHighest = carparkGroupedByCategory["Medium"].reduce((maxCarpark, carpark) => {
  //     return maxCarpark.lotsAvailable > carpark.lotsAvailable ? maxCarpark : carpark;
  //   })

  //   const mediumCarparkLowest = carparkGroupedByCategory["Medium"].reduce((minCarpark, carpark) => {
  //     return minCarpark.lotsAvailable < carpark.lotsAvailable ? minCarpark : carpark;
  //   })

  //   const bigCarparkHighest = carparkGroupedByCategory["Big"].reduce((maxCarpark, carpark) => {
  //     return maxCarpark.lotsAvailable > carpark.lotsAvailable ? maxCarpark : carpark;
  //   })

  //   const bigCarparkLowest = carparkGroupedByCategory["Big"].reduce((minCarpark, carpark) => {
  //     return minCarpark.lotsAvailable < carpark.lotsAvailable ? minCarpark : carpark;
  //   })

  //   const largeCarparkHighest = carparkGroupedByCategory["Large"].reduce((maxCarpark, carpark) => {
  //     return maxCarpark.lotsAvailable > carpark.lotsAvailable ? maxCarpark : carpark;
  //   })

  //   const largeCarparkLowest = carparkGroupedByCategory["Large"].reduce((minCarpark, carpark) => {
  //     return minCarpark.lotsAvailable < carpark.lotsAvailable ? minCarpark : carpark;
  //   })
};

export default useCarparkAPI;

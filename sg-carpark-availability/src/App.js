import useCarparkAPI from "./useCarparkAPI";

function App() {
  const data = useCarparkAPI();
  return (
    data !== null &&
    data.map((carparkData) => {
      return (
        <>
          <h1>
            <strong>{carparkData.category}</strong>
          </h1>
          <div>Highest ({carparkData.highestNumberOfLots} lots available)</div>
          <div>
            {carparkData.listOfCarparksWithHighestAvailability.toString()}
          </div>
          <br />
          <div>Lowest ({carparkData.lowestNumberOfLots} lots available)</div>
          <div>
            {carparkData.listOfCarparksWithLowestAvailability.toString()}
          </div>
          <br />
          <div>-------------------------------------------------</div>
        </>
      );
    })
  );
}

export default App;

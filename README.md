# Singapore Carpark Availability

This app shows carparks in Singapore with the highest and lowest available lots.\
The data is sourced from [DataGovSg](https://data.gov.sg/dataset/carpark-availability?resource_id=4f4a57d1-e904-4326-b83e-dae99358edf9)

1. Run `docker build -t sg-carpark-availability:1 .\sg-carpark-availability\` to build the docker image.
2. Run `docker run -d --rm -p 80:80 --name sg-carpark-availability sg-carpark-availability:1` to spin up the app.
3. Open browser and browse to "localhost" on the address bar.
4. App is running and will poll every 60 seconds, open console to see polling.
5. Run `docker stop sg-carpark-availability` to stop the container.
6. Run `docker rmi -f sg-carpark-availability:1` to remove the docker image locally.

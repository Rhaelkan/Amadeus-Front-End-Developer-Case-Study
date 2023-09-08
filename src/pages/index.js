import { useState, useEffect } from "react";
import Image from "next/image";
import loadingAnimation from "@/flight_animation3.gif";
import errorAnimation from "@/error_animation.gif";
import departureCities from "@/constants/departureCities";
import arrivalCities from "@/constants/arrivalCities";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/de";
import dayjs from "dayjs";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Head from "next/head";

export default function Home() {
  const [radioInputValue, setRadioInputValue] = useState(true);

  const [departureAirportValue, setDepartureAirportValue] = useState("");
  const [departureAirportInputValue, setDepartureAirportInputValue] =
    useState("");

  const [arrivalAirportValue, setArrivalAirportValue] = useState("");
  const [arrivalAirportInputValue, setArrivalAirportInputValue] = useState("");

  const [departureDateInput, setDepartureDateInput] = useState("");
  const [returnDateInput, setReturnDateInput] = useState("");

  const [filteredFlights, setFilteredFlights] = useState([]);

  const [loading, setLoading] = useState(false);

  const [sortOption, setSortOption] = useState("departureTime");
  const [sortOrder, setSortOrder] = useState("asc");
  
  function convertDurationToMinutes(duration) {
    const parts = duration.split(' ');
    let totalMinutes = 0;
  
    for (const part of parts) {
      if (part.includes('h')) {
        totalMinutes += parseInt(part) * 60;
      } else if (part.includes('m')) {
        totalMinutes += parseInt(part);
      }
    }
  
    return totalMinutes;
  }  

  const sortFlights = () => {
    const sortedFlights = [...filteredFlights].sort((a, b) => {
      if (sortOption === 'departureTime' || sortOption === 'arrivalTime') {
        // For time-based sorting, convert time strings to Date objects for comparison
        const aValue = new Date(`2000-01-01T${a[sortOption]}`);
        const bValue = new Date(`2000-01-01T${b[sortOption]}`);
  
        if (sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else if (sortOption === 'flightDuration') {
        // For flight duration sorting, use the converted minutes
        const aValue = convertDurationToMinutes(a[sortOption]);
        const bValue = convertDurationToMinutes(b[sortOption]);
  
        if (sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else if (sortOption === 'price') {
        // For price sorting, compare prices numerically
        const aValue = parseFloat(a[sortOption]);
        const bValue = parseFloat(b[sortOption]);
  
        if (sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
    });
    setFilteredFlights(sortedFlights);
  };
  

  useEffect(() => {
    const radioInputTerm = radioInputValue;
    const departureAirportTerm = departureAirportInputValue.toLowerCase();
    const arrivalAirportTerm = arrivalAirportInputValue.toLowerCase();
    const departureDateTerm = departureDateInput.toLowerCase();
    const returnDateTerm = returnDateInput.toLowerCase();

    const flights = () => {
      setLoading(true);
      const queryString = new URLSearchParams({
        radioInputTerm: radioInputTerm,
        departureAirportTerm: departureAirportTerm || "",
        arrivalAirportTerm: arrivalAirportTerm || "",
        departureDateTerm: departureDateTerm || "",
        returnDateTerm: returnDateTerm || "",
      }).toString();
  
      fetch(`/api/hello?${queryString}`)
        .then((response) => response.json())
        .then((data) => {
          setTimeout(() => {
            if (Array.isArray(data)) {
              if (!returnDateInput || returnDateInput === "One way") {
                setFilteredFlights(data);
              } else {
                const filteredByReturnDate = data.filter(
                  (flight) => flight.returnDate === returnDateInput
                );
                setFilteredFlights(filteredByReturnDate);
              }
            } else {
              
              console.error("Invalid data format:", data);
              setFilteredFlights([]);
            }
            setLoading(false);
          }, 1000);
        });
    };
    flights();
  }, [
    radioInputValue,
    departureAirportInputValue,
    arrivalAirportInputValue,
    departureDateInput,
    returnDateInput,
  ]);

  return (
    <>
    <Head>
      <title>Amadeus | Flight Search Application</title>
    </Head>
    <main className="mt-36 sm:mt-60 flex flex-col">
      <div className="px-6 py-2 w-fit flex items-center rounded-tl-lg rounded-tr-lg gap-2 bg-sky-100">
        <svg
          class="h-8 w-8 text-sky-500"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2-4l-2 -4h3l2 2h4l-2 -7h3z" />
        </svg>
        <h1 className="text-sky-500 font-semibold">Flight Search</h1>
      </div>

      <div className="p-6 rounded-tr-lg rounded-b-lg shadow-xl">
        <ThemeProvider theme={theme}>
          <div>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={radioInputValue}
                name="radio-buttons-group"
              >
                <div className="flex items-center">
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Round Trip"
                    onClick={() => setRadioInputValue(true)}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="One Way"
                    onClick={() => setRadioInputValue(false)}
                  />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
          <div className="flex max-xl:flex-wrap items-center gap-4 mt-3">
            <Autocomplete
              value={departureAirportValue}
              onChange={(event, newValue) => {
                setDepartureAirportValue(newValue);
              }}
              departureAirportInputValue={departureAirportInputValue}
              onInputChange={(event, newInputValue) => {
                setDepartureAirportInputValue(newInputValue);
              }}
              id="controllable-states-demo"
              options={departureCities.map((departureCity) => [
                `${departureCity.airportCode} ${departureCity.city} ${departureCity.country}`,
              ])}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label={`Select a departure airport`} />
              )}
            />

            <Autocomplete
              value={arrivalAirportValue}
              onChange={(event, newValue) => {
                setArrivalAirportValue(newValue);
              }}
              arrivalAirportInputValue={arrivalAirportInputValue}
              onInputChange={(event, newInputValue) => {
                setArrivalAirportInputValue(newInputValue);
              }}
              id="controllable-states-demo"
              options={arrivalCities.map((arrivalCity) => [
                `${arrivalCity.airportCode} ${arrivalCity.city} ${arrivalCity.country}`,
              ])}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label={`Select an arrival airport`} />
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
              <DatePicker
                label="Select a departure date"
                disablePast
                value={dayjs(departureDateInput)}
                onChange={(newValue) =>
                  setDepartureDateInput(newValue.format("DD-MM-YYYY"))
                }
              />
              {radioInputValue === true && (
                <DatePicker
                  label="Select a return date"
                  disablePast
                  value={dayjs(returnDateInput)}
                  onChange={(newValue) =>
                    setReturnDateInput(newValue.format("DD-MM-YYYY"))
                  }
                />
              )}
              {radioInputValue === false && (
                <DatePicker label="You've selected one way trip" disabled />
              )}
            </LocalizationProvider>
          </div>
        </ThemeProvider>
      </div>
      <div className="flex flex-col py-20">
        <div className="flex items-center gap-2 mr-1 justify-end">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded p-2 bg-sky-50 text-sky-400 font-medium outline-sky-400"
          >
            <option
              value="departureTime"
              className="bg-white text-gray-700 font-medium"
            >
              Departure Time
            </option>
            <option
              value="arrivalTime"
              className="bg-white text-gray-700 font-medium"
            >
              Arrival Time
            </option>
            <option
              value="flightDuration"
              className="bg-white text-gray-700 font-medium"
            >
              Flight Duration
            </option>
            <option
              value="price"
              className="bg-white text-gray-700 font-medium"
            >
              Price
            </option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded p-2 bg-sky-50 text-sky-400 font-medium outline-sky-400"
          >
            <option value="asc" className="bg-white text-gray-700 font-medium">
              Ascending
            </option>
            <option value="desc" className="bg-white text-gray-700 font-medium">
              Descending
            </option>
          </select>
          <button
            onClick={sortFlights}
            className="flex items-center gap-x-2 px-6 py-2 font-medium rounded shadow-lg text-white bg-sky-400 hover:bg-sky-500 hover:duration-300 focus:outline-none focus:ring focus:ring-sky-300"
          >
            
            <svg
              class="h-5 w-5 text-white"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M3 9l4-4l4 4m-4 -4v14" />{" "}
              <path d="M21 15l-4 4l-4-4m4 4v-14" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-8 justify-center mt-4">
          {!loading && filteredFlights?.message && (
            <div className="flex flex-col gap-8 items-center text-xl font-medium text-gray-600">
              <h1>{filteredFlights.message}</h1>
              <Image
                src={errorAnimation}
                width={450}
                height={450}
                alt="Error Animation GIF"
                className="rounded-2xl"
              />
            </div>
          )}
          {loading && (
            <div className="flex flex-col gap-8 items-center text-xl font-medium text-gray-600">
              <h1>Searching best flights for you...</h1>
              <Image
                src={loadingAnimation}
                width={450}
                height={450}
                alt="Flight Animation GIF"
                className="rounded-2xl"
              />
            </div>
          )}
          {!loading && filteredFlights !== null && (
            !filteredFlights.message && filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <div
                key={flight.id}
                className="flex flex-col p-6 py-10 bg-sky-100 rounded-lg min-w-[388px]"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center leading-none">
                    <svg
                      class="h-8 w-8 text-sky-500 -mt-7 mx-auto"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      {" "}
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <path
                        d="M15 12h5a2 2 0 0 1 0 4h-15l-3 -6h3l2 2h3l-2 -7h3z"
                        transform="rotate(-15 12 12) translate(0 -1)"
                      />{" "}
                      <line x1="3" y1="21" x2="21" y2="21" />
                    </svg>
                    <h1 className="text-lg font-medium text-gray-600">
                      {flight.departureAirportCode}
                    </h1>
                  </div>

                  <div className="border-t-[0.1px] border-gray-400 w-[70px]" />
                  <div className="-mt-6">
                    <h1 className="text-xl">{flight.flightDuration}</h1>
                    <Image
                      src="/amadeus_logo.jpeg"
                      width={70}
                      height={70}
                      className="mx-auto"
                    />
                  </div>

                  <div className="border-t-[0.1px] border-gray-400 w-[70px]" />

                  <div>
                    <svg
                      class="h-8 w-8 text-sky-500 -mt-7 mx-auto"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      {" "}
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <path
                        d="M15 12h5a2 2 0 0 1 0 4h-15l-3 -6h3l2 2h3l-2 -7h3z"
                        transform="rotate(15 12 12) translate(0 -1)"
                      />{" "}
                      <line x1="3" y1="21" x2="21" y2="21" />
                    </svg>
                    <h1 className="text-lg font-medium text-gray-600">
                      {flight.arrivalAirportCode}
                    </h1>
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <svg
                        class="h-8 w-8 text-sky-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div className="text-xs font-medium leading-tight">
                        <h1>{flight.departureCity}</h1>
                        <h1>{flight.departureCountry}</h1>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="text-xs font-medium leading-tight text-right">
                        <h1>{flight.arrivalCity}</h1>
                        <h1>{flight.arrivalCountry}</h1>
                      </div>
                      <svg
                        class="h-8 w-8 text-sky-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <svg
                        class="h-8 w-8 text-sky-400"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <rect x="4" y="5" width="16" height="16" rx="2" />{" "}
                        <line x1="16" y1="3" x2="16" y2="7" />{" "}
                        <line x1="8" y1="3" x2="8" y2="7" />{" "}
                        <line x1="4" y1="11" x2="20" y2="11" />{" "}
                        <rect x="8" y="15" width="2" height="2" />
                      </svg>
                      <div className="text-xs font-medium leading-tight">
                        <h1>Departure Date</h1>
                        <h1>{flight.departureDate}</h1>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="text-xs font-medium leading-tight text-right">
                        <h1>Return Date</h1>
                        <h1>
                          {flight.isRoundTrip ? flight.returnDate : "One way"}
                        </h1>
                      </div>
                      <svg
                        class="h-8 w-8 text-sky-400"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <rect x="4" y="5" width="16" height="16" rx="2" />{" "}
                        <line x1="16" y1="3" x2="16" y2="7" />{" "}
                        <line x1="8" y1="3" x2="8" y2="7" />{" "}
                        <line x1="4" y1="11" x2="20" y2="11" />{" "}
                        <rect x="8" y="15" width="2" height="2" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <svg
                        class="h-8 w-8 text-sky-400"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        {" "}
                        <circle cx="12" cy="12" r="10" />{" "}
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <div className="text-xs font-medium leading-tight">
                        <h1>Departure Time</h1>
                        <h1>{flight.departureTime}</h1>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="text-xs font-medium leading-tight text-right">
                        <h1>Arrival Time</h1>
                        <h1>{flight.arrivalTime}</h1>
                      </div>
                      <svg
                        class="h-8 w-8 text-sky-400"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        {" "}
                        <circle cx="12" cy="12" r="10" />{" "}
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center text-lg font-medium text-sky-700">
                    ${flight.price}
                  </div>
                </div>
              </div>
            ))): <div className="flex flex-col gap-8 items-center text-xl font-medium text-gray-600">
            <h1>Unfortunately, the flight you are looking for is not available. Sorry you will have to take the bus :(</h1>
            <Image
              src={errorAnimation}
              width={450}
              height={450}
              alt="Error Animation GIF"
              className="rounded-2xl"
            />
          </div>)}
        </div>
      </div>
    </main>
    </>
  );
}

const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

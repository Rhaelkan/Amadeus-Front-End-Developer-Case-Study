// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import flights from "../api/flights.json";

export default function handler(req, res) {
  const {
    radioInputTerm,
    departureAirportTerm,
    arrivalAirportTerm,
    departureDateTerm,
    returnDateTerm,
  } = req.query;

  if(flights.length < 1){
    res.status(500).json({
      message: "Internal Server Error!"
    })
  }

  const filtered = flights.filter((flight) => {
    const lowerDepartureAirport =
      `${flight.departureAirportCode} ${flight.departureCity} ${flight.departureCountry}`.toLowerCase();
    const lowerArrivalAirport =
      `${flight.arrivalAirportCode} ${flight.arrivalCity} ${flight.arrivalCountry}`.toLowerCase();

    const departureDateLower = flight.departureDate;
    const returnDateLower = flight.returnDate;

    const isDepartureAirportMatched = lowerDepartureAirport.includes(
      departureAirportTerm.toLowerCase()
    );

    const isArrivalAirportMatched = lowerArrivalAirport.includes(
      arrivalAirportTerm.toLowerCase()
    );

    const isDepartureDateMatched =
      departureDateLower.includes(departureDateTerm);

    const isReturnDateMatched = returnDateLower.includes(returnDateTerm);

    return (
      flight.isRoundTrip.toString() === radioInputTerm &&
      isDepartureAirportMatched &&
      isArrivalAirportMatched &&
      isDepartureDateMatched &&
      (flight.isRoundTrip === "true" ? isReturnDateMatched : true)
    );
  });

  if (filtered.length > 0) {
    res.status(200).json(filtered);
  } else {
    res.status(404).json({
      message: "Unfortunately, the flight you are looking for is not available.  Sorry you will have to take the bus :("
    })
  }
}

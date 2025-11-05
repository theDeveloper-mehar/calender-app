import React, { useState, useReducer, useEffect } from "react";
import dayjs from "dayjs";
import GlobalContext from "./GlobalContext";

function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((evt) => (evt.id === payload.id ? payload : evt));
    case "delete":
      return state.filter((evt) => evt.id !== payload.id);
    default:
      throw new Error();
  }
}

const staticEvents = [
  {
    id: "static-1",
    title: "Team Meeting",
    description: "Frontend sync-up",
    label: "blue",
    day: dayjs().startOf("day").valueOf(),
  },
  {
    id: "static-2",
    title: "Yoga Session",
    description: "Morning practice",
    label: "green",
    day: dayjs().add(1, "day").startOf("day").valueOf(),
  },
  {
    id: "static-3",
    title: "Project Submission",
    description: "Frontend Labs Assignment",
    label: "red",
    day: dayjs().add(3, "day").startOf("day").valueOf(),
  },
];

export function GlobalProvider({ children }) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [showEventModal, setShowEventModal] = useState(false);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);

  const storedEvents = useReducer(
    savedEventsReducer,
    [],
    () => JSON.parse(localStorage.getItem("savedEvents")) || []
  );

  const [state, dispatchCalEvent] = storedEvents;

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(state));
  }, [state]);

  const allEvents = [...staticEvents, ...state];

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        savedEvents: allEvents,
        selectedEvent,
        setSelectedEvent,
        labels,
        setLabels,
        filteredEvents: allEvents,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;

import React from 'react';
import { useRouter } from 'next/router';

export default function EventDetails() {
  const router = useRouter();
  const { eventID } = router.query;

  return (
    <div>
      <h1>Event Details for ID: {eventID}</h1>
      <p>Here you can show details for the event with ID {eventID}.</p>
    </div>
  );
}

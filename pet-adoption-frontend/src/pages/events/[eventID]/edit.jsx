import React from 'react';
import { useRouter } from 'next/router';

export default function EditEvent() {

    
    const router = useRouter();
    const eventID = router.query;   // Extract eventID from URL
    const actualEventID = eventID && typeof eventID === 'object' ? eventID.eventID : eventID;

    if (!actualEventID) return <><h1>Loading...</h1></>

    return (
        <>
            <h1>This is the edit page for {actualEventID}</h1>
        </>
    );
}
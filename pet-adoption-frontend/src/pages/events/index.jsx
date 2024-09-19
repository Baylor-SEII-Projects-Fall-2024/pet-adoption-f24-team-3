import React from 'react';
import { useRouter } from 'next/router'
import { Button } from '@mui/material'

export default function EventsPage() {
    const router = useRouter();
    return (
        <div>
            <h1>This is where events can be found!</h1>
            <form>
                <input type="number" id="searchTxt"/>
            </form>
            <Button variant='contained' onClick={() => router.push(`/events/${document.getElementById('searchTxt').value}`)} sx={{ width: 200 }}>Find an event!</Button>
        </div>
    );
}
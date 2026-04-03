import { NextResponse } from 'next/server';

export async function GET() {
  // Direct GSFC EPIC API (Public, no key required usually)
  const url = 'https://epic.gsfc.nasa.gov/api/natural';

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) throw new Error(`EPIC GSFC API Error: ${res.status}`);
    const data = await res.json();
    
    // Sort by date descending and get latest 12
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 12);

    // Transform and add image URLs (GSFC specific structure)
    const enrichedData = sortedData.map(img => {
      const dateParts = img.date.split(' ')[0].split('-');
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      
      return {
        ...img,
        // Using the GSFC archive URL directly
        url: `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${img.image}.png`
      };
    });

    return NextResponse.json(enrichedData);
  } catch (err) {
    console.error('EPIC Refactor Error:', err);
    return NextResponse.json({ error: 'EPIC GSFC Failure', detail: err.message }, { status: 502 });
  }
}

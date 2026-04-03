export const PLANETS_DATA = [
  {
    id: "mercury",
    name: "Mercury",
    color: "#a8a29e", // neon effect base color
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/800px-Mercury_in_true_color.jpg",
    stats: {
      diameter: "4,880 km",
      distanceFromSun: "58 Million km",
      orbitPeriod: "88 Earth days",
      surfaceTemperature: "-173°C to 427°C"
    },
    atmosphere: [
      { element: "Oxygen", percentage: 42, color: "#3b82f6" },
      { element: "Sodium", percentage: 29, color: "#f59e0b" },
      { element: "Hydrogen", percentage: 22, color: "#10b981" },
      { element: "Helium", percentage: 6, color: "#8b5cf6" }
    ],
    facts: [
      "Mercury is the smallest planet in the Solar System.",
      "It has the most eccentric orbit of all the planets.",
      "Mercury has no moons or rings.",
      "A day on the surface of Mercury lasts 176 Earth days."
    ],
    missions: [
      { year: "1974", name: "Mariner 10", description: "First spacecraft to visit Mercury." },
      { year: "2008", name: "MESSENGER", description: "First to orbit Mercury, mapping 100% of the surface." },
      { year: "2018", name: "BepiColombo", description: "ESA/JAXA joint mission currently en route." }
    ]
  },
  {
    id: "venus",
    name: "Venus",
    color: "#f59e0b",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg",
    stats: {
      diameter: "12,104 km",
      distanceFromSun: "108 Million km",
      orbitPeriod: "225 Earth days",
      surfaceTemperature: "462°C"
    },
    atmosphere: [
      { element: "Carbon Dioxide", percentage: 96.5, color: "#dc2626" },
      { element: "Nitrogen", percentage: 3.5, color: "#6b7280" }
    ],
    facts: [
      "Venus is the hottest planet in our solar system.",
      "It rotates in the opposite direction to most other planets.",
      "Venus is the second brightest natural object in the night sky.",
      "Atmospheric pressure is 92 times that of Earth."
    ],
    missions: [
      { year: "1970", name: "Venera 7", description: "First successful soft landing on another planet." },
      { year: "1989", name: "Magellan", description: "Mapped 98% of the surface using synthetic aperture radar." }
    ]
  },
  {
    id: "earth",
    name: "Earth",
    color: "#3b82f6",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg",
    stats: {
      diameter: "12,742 km",
      distanceFromSun: "149.6 Million km",
      orbitPeriod: "365.25 days",
      surfaceTemperature: "-88°C to 58°C"
    },
    atmosphere: [
      { element: "Nitrogen", percentage: 78, color: "#8b5cf6" },
      { element: "Oxygen", percentage: 21, color: "#3b82f6" },
      { element: "Argon", percentage: 0.9, color: "#10b981" },
      { element: "Carbon Dioxide", percentage: 0.1, color: "#dc2626" }
    ],
    facts: [
      "Earth is the only planet known to harbor life.",
      "It is the only planet with liquid water on its surface.",
      "Earth's magnetic field protects life from harmful solar radiation.",
      "It is the densest planet in the Solar System."
    ],
    missions: [
      { year: "1957", name: "Sputnik 1", description: "First artificial Earth satellite." },
      { year: "1990", name: "Hubble Space Telescope", description: "Launched into low Earth orbit, revolutionizing astronomy." },
      { year: "1998", name: "International Space Station", description: "Habitable artificial satellite in low Earth orbit." }
    ]
  },
  {
    id: "mars",
    name: "Mars",
    color: "#ef4444",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
    stats: {
      diameter: "6,779 km",
      distanceFromSun: "228 Million km",
      orbitPeriod: "687 Earth days",
      surfaceTemperature: "-153°C to 20°C"
    },
    atmosphere: [
      { element: "Carbon Dioxide", percentage: 95.3, color: "#dc2626" },
      { element: "Nitrogen", percentage: 2.7, color: "#6b7280" },
      { element: "Argon", percentage: 1.6, color: "#f59e0b" }
    ],
    facts: [
      "Mars is home to the tallest mountain in the solar system, Olympus Mons.",
      "Pieces of Mars have fallen to Earth as meteorites.",
      "Mars has two small moons: Phobos and Deimos.",
      "Liquid water may still occasionally flow on the surface."
    ],
    missions: [
      { year: "1976", name: "Viking 1 & 2", description: "First successful landings and surface images." },
      { year: "2012", name: "Curiosity Rover", description: "Determined that Mars could have once supported life." },
      { year: "2021", name: "Perseverance Rover", description: "Searching for signs of ancient microbial life." }
    ]
  },
  {
    id: "jupiter",
    name: "Jupiter",
    color: "#d97706",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
    stats: {
      diameter: "139,820 km",
      distanceFromSun: "778 Million km",
      orbitPeriod: "11.9 Earth years",
      surfaceTemperature: "-110°C"
    },
    atmosphere: [
      { element: "Hydrogen", percentage: 89.8, color: "#10b981" },
      { element: "Helium", percentage: 10.2, color: "#8b5cf6" }
    ],
    facts: [
      "Jupiter is two and a half times more massive than all the other planets combined.",
      "The Great Red Spot is a giant storm that has raged for at least 400 years.",
      "Jupiter has 95 known moons.",
      "It has a faint ring system made mostly of dust."
    ],
    missions: [
      { year: "1973", name: "Pioneer 10", description: "First spacecraft to fly past Jupiter." },
      { year: "1995", name: "Galileo", description: "First spacecraft to orbit Jupiter and drop a probe into its atmosphere." },
      { year: "2016", name: "Juno", description: "Studying Jupiter's composition, gravity, magnetic field, and polar magnetosphere." }
    ]
  },
  {
    id: "saturn",
    name: "Saturn",
    color: "#fde047",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
    stats: {
      diameter: "116,460 km",
      distanceFromSun: "1.4 Billion km",
      orbitPeriod: "29.5 Earth years",
      surfaceTemperature: "-140°C"
    },
    atmosphere: [
      { element: "Hydrogen", percentage: 96.3, color: "#10b981" },
      { element: "Helium", percentage: 3.2, color: "#8b5cf6" }
    ],
    facts: [
      "Saturn has the most extensive ring system in the solar system.",
      "It is the only planet less dense than water.",
      "Saturn has 146 known moons, more than any other planet.",
      "A storm at Saturn's north pole is shaped like a hexagon."
    ],
    missions: [
      { year: "1979", name: "Pioneer 11", description: "First spacecraft to fly past Saturn." },
      { year: "2004", name: "Cassini-Huygens", description: "First to orbit Saturn and land a probe (Huygens) on its moon Titan." }
    ]
  },
  {
    id: "uranus",
    name: "Uranus",
    color: "#0ea5e9",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg",
    stats: {
      diameter: "50,724 km",
      distanceFromSun: "2.9 Billion km",
      orbitPeriod: "84 Earth years",
      surfaceTemperature: "-195°C"
    },
    atmosphere: [
      { element: "Hydrogen", percentage: 83, color: "#10b981" },
      { element: "Helium", percentage: 15, color: "#8b5cf6" },
      { element: "Methane", percentage: 2, color: "#3b82f6" }
    ],
    facts: [
      "Uranus rotates on its side, with an axial tilt of 98 degrees.",
      "It is the coldest planetary atmosphere in the Solar System.",
      "Uranus has 13 known rings, which are very dark and faint.",
      "It was the first planet discovered using a telescope."
    ],
    missions: [
      { year: "1986", name: "Voyager 2", description: "The only spacecraft to have visited Uranus so far." }
    ]
  },
  {
    id: "neptune",
    name: "Neptune",
    color: "#2563eb",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg",
    stats: {
      diameter: "49,244 km",
      distanceFromSun: "4.5 Billion km",
      orbitPeriod: "165 Earth years",
      surfaceTemperature: "-200°C"
    },
    atmosphere: [
      { element: "Hydrogen", percentage: 80, color: "#10b981" },
      { element: "Helium", percentage: 19, color: "#8b5cf6" },
      { element: "Methane", percentage: 1, color: "#3b82f6" }
    ],
    facts: [
      "Neptune has the strongest winds in the solar system, up to 2,100 km/h.",
      "It was the first planet predicted by mathematical calculations before being observed.",
      "Neptune has a Great Dark Spot, similar to Jupiter's Great Red Spot.",
      "Its moon Triton orbits in the opposite direction to Neptune's rotation."
    ],
    missions: [
      { year: "1989", name: "Voyager 2", description: "The only spacecraft to have visited Neptune, flying within 3,000 km of its north pole." }
    ]
  }
];

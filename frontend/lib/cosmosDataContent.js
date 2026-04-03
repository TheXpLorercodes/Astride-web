export const ENCYC_DATA = {
    objects: [
        {
            id: "earth", category: "solarsys", name: "Earth", alternateNames: ["Terra", "Gaia", "Blue Marble"],
            badge: "Terrestrial Planet", tagline: "The cradle of humanity and the only known harbor of life.",
            heroParagraph: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. Radiometric dating indicates that Earth formed over 4.5 billion years ago. Earth's gravity interacts with other objects in space, especially the Sun and the Moon. Earth orbits around the Sun in about 365.25 days.",
            quickFacts: [
                { k: "Mean Radius", v: "6,371 km" }, { k: "Mass", v: "5.97 × 10²⁴ kg" }, { k: "Surface Gravity", v: "9.807 m/s²" },
                { k: "Orbital Period", v: "365.25 days" }, { k: "Axial Tilt", v: "23.44°" }
            ],
            discovery: "Prehistoric. The realization that Earth is a planet rather than the stationary center of the universe was a gradual realization starting with ancient Greek heliocentrism, solidified by Copernicus.",
            tabs: {
                overview: [
                    { title: "Historical Context", text: "Historically, Earth was perceived as the stationary center of the universe. The transition to the heliocentric model revolutionized human understanding of our place in the cosmos." },
                    { title: "Biological Significance", text: "Earth is uniquely characterized by its ability to support a vast, complex web of life. The presence of liquid water oceans, which cover 71% of the surface, coupled with a dense, oxygen-rich atmosphere, creates a stable thermal environment." }
                ],
                composition: [
                    { layer: "Iron/Nickel Core", pct: 32, color: "#e63946" },
                    { layer: "Silicate Mantle", pct: 67, color: "#f4a261" },
                    { layer: "Crust", pct: 1, color: "#2a9d8f" }
                ],
                missions: [
                    { year: "1957", name: "Sputnik 1", summary: "The Soviet Union launched the first artificial satellite into low Earth orbit, inaugurating the Space Age." },
                    { year: "1968", name: "Apollo 8", summary: "The first manned mission to leave Earth orbit. It returned the iconic 'Earthrise' photograph, fundamentally altering humanity's perspective." }
                ]
            }
        },
        {
            id: "andromeda", category: "galaxies", name: "Andromeda Galaxy", alternateNames: ["M31", "NGC 224"],
            badge: "Barred Spiral Galaxy", tagline: "Our massive galactic neighbor, hurdling toward a collision.",
            heroParagraph: "The Andromeda Galaxy is a barred spiral galaxy approximately 2.5 million light-years from Earth and the nearest major galaxy to the Milky Way.",
            quickFacts: [
                { k: "Distance", v: "2.54 × 10⁶ ly" }, { k: "Diameter", v: "~152,000 ly" }, { k: "Mass", v: "1.5 × 10¹² M☉" },
                { k: "Number of Stars", v: "~1 Trillion" }
            ],
            discovery: "First officially documented in 964 AD by the Persian astronomer Abd al-Rahman al-Sufi.",
            tabs: {
                overview: [
                    { title: "Galactic Context", text: "Andromeda dominates the Local Group in terms of mass and structural expansion. For centuries, it was believed to be a 'spiral nebula' situated within our own Milky Way." },
                    { title: "Approaching Collision", text: "Unlike most galaxies that are receding due to cosmic expansion, Andromeda exhibits a blueshift. It is approaching the Milky Way at approximately 110 kilometers per second." }
                ],
                composition: [
                    { layer: "Dark Matter Halo", pct: 70, color: "#2E1065" },
                    { layer: "Stellar Mass", pct: 25, color: "#8B5CF6" },
                    { layer: "Interstellar Gas/Dust", pct: 5, color: "#C4B5FD" }
                ],
                missions: [
                    { year: "2003", name: "GALEX Observatory", summary: "The Galaxy Evolution Explorer surveyed Andromeda in ultraviolet light, revealing expansive, unexpected rings of young stars." },
                    { year: "2015", name: "Hubble PHAT Survey", summary: "Captured a monumental 1.5-billion-pixel mosaic of the galaxy, resolving over 100 million individual stars." }
                ],
                categorySpecific: {
                    label: "STRUCTURE",
                    title: "Anatomy of a Barred Spiral",
                    text: "Andromeda's structure is remarkably intricate. Though often classified as a standard unbarred spiral, recent infrared surveys strongly suggest the presence of a distinct central bar structure."
                }
            }
        },
        {
            id: "betelgeuse", category: "stars", name: "Betelgeuse", alternateNames: ["Alpha Orionis"],
            badge: "Red Supergiant", tagline: "A colossal dying star looming on the precipice of a supernova.",
            heroParagraph: "Betelgeuse is a distinctly reddish, semiregular variable star located in the constellation of Orion. If positioned at the center of our Solar System, its surface would extend past the asteroid belt.",
            quickFacts: [
                { k: "Spectral Type", v: "M1–M2 Ia–ab" }, { k: "Distance", v: "~548 light-years" }, { k: "Luminosity", v: "90,000–150,000 L☉" }
            ],
            discovery: "Known since antiquity as a crucial navigational and mythological anchor.",
            tabs: {
                overview: [
                    { title: "A Prominent Variable", text: "Betelgeuse commands the night sky as the striking right shoulder of the Orion constellation. It exhibits substantial variability in its apparent luminosity." },
                    { title: "The Great Dimming", text: "Between late 2019 and early 2020, Betelgeuse underwent a historical and unprecedented 'Great Dimming,' plunging to a magnitude of 1.61, the faintest ever definitively recorded." }
                ],
                composition: [
                    { layer: "Convective Envelope", pct: 80, color: "#dc2626" },
                    { layer: "Hydrogen Fusion Shell", pct: 5, color: "#fcd34d" },
                    { layer: "Helium/Carbon Core", pct: 15, color: "#ffffff" }
                ],
                missions: [
                    { year: "1990", name: "Hubble Observations", summary: "Hubble captured the first direct image of the disk of a star other than the Sun, revealing a massive ultraviolet hot spot." }
                ],
                categorySpecific: {
                    label: "LIFECYCLE",
                    title: "Toward the final collapse",
                    text: "Having exhausted its primary fuel, gravitational forces caused the core to contract and drastically heat up, triggering the intense fusion of heavier elements. It will eventually collapse into a Type II supernova."
                }
            }
        }
    ]
};

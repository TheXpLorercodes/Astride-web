import { fetchById, fetchRelatedItems, fetchPlanets, fetchStars, fetchGalaxies, fetchAsteroids, fetchMoons, fetchSatellites } from '../../../../lib/cosmoDataApi';
import { ENCYC_DATA } from '../../../../lib/cosmosDataContent';
import ObjectDetailsClient from '../../../../components/ObjectDetails/ObjectDetailsClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { table, id } = await params;
  const { data: item } = await fetchById(table, id);
  if (!item) return { title: 'Not Found' };
  
  return {
    title: item.name,
    description: item.description,
  };
}

export default async function ObjectDetailsPage({ params }) {
  const { table, id } = await params;

  let fetchSiblings;
  if (table === 'planets') fetchSiblings = fetchPlanets;
  else if (table === 'moons') fetchSiblings = fetchMoons;
  else if (table === 'stars') fetchSiblings = fetchStars;
  else if (table === 'galaxies') fetchSiblings = fetchGalaxies;
  else if (table === 'asteroids') fetchSiblings = fetchAsteroids;
  else if (table === 'satellites') fetchSiblings = fetchSatellites;

  const [itemRes, relatedRes, siblingsRes] = await Promise.all([
    fetchById(table, id),
    fetchRelatedItems(table, id),
    fetchSiblings ? fetchSiblings() : Promise.resolve({ data: [] })
  ]);

  if (!itemRes.data) return notFound();

  const item = itemRes.data;
  const related = relatedRes.data || [];
  const siblings = siblingsRes?.data || [];
  const encData = ENCYC_DATA.objects.find(o => o.name.toLowerCase() === item.name.toLowerCase());

  return <ObjectDetailsClient table={table} id={id} item={item} related={related} encData={encData} siblings={siblings} />;
}

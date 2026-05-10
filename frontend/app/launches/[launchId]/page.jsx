import { notFound } from 'next/navigation';
import LaunchTrackerView from './LaunchTrackerView';
import { supabaseServer } from '../../../lib/supabaseServer';

export const revalidate = 3600;

const LAUNCH_PREVIEW_SELECT =
  'id,name,net,window_start,window_end,launch_service_provider,rocket,mission,pad,image,infographic,status,probability';

function isMissingTableError(error) {
  return (
    error?.code === 'PGRST205' ||
    (typeof error?.message === 'string' && error.message.includes('Could not find the table'))
  );
}

function buildPreview(launch, relationLabel) {
  return {
    id: launch.id,
    relationLabel,
    name: launch.mission?.name || launch.name || 'Launch',
    summary:
      launch.mission?.description ||
      `${launch.launch_service_provider?.name || 'Mission Control'} is tracking this mission from ${
        launch.pad?.name || 'the launch site'
      }.`,
    provider: launch.launch_service_provider?.name || 'Mission Control',
    dateLabel: launch.net
      ? new Date(launch.net).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        })
      : 'TBD',
    image:
      launch.image ||
      launch.infographic ||
      launch.pad?.map_image ||
      launch.pad?.location?.map_image ||
      null,
  };
}

async function loadLaunchTrackerContext(launchId) {
  const { data: launch, error: launchError } = await supabaseServer
    .from('launches')
    .select('*')
    .eq('id', launchId)
    .maybeSingle();

  if (launchError) {
    throw new Error(launchError.message);
  }

  if (!launch) {
    return null;
  }

  let trackerProfile = null;
  try {
    const { data, error } = await supabaseServer
      .from('launch_tracker_profiles')
      .select('*')
      .eq('launch_id', launchId)
      .maybeSingle();

    if (error && !isMissingTableError(error)) {
      console.warn('[launch tracker] profile lookup warning:', error.message);
    }

    trackerProfile = data || null;
  } catch (error) {
    console.warn('[launch tracker] profile lookup warning:', error.message);
  }

  const { data: launchRows, error: launchRowsError } = await supabaseServer
    .from('launches')
    .select(LAUNCH_PREVIEW_SELECT)
    .order('net', { ascending: true });

  if (launchRowsError) {
    throw new Error(launchRowsError.message);
  }

  const orderedLaunches = Array.isArray(launchRows) ? launchRows : [];
  const previewLookup = new Map(orderedLaunches.map((item) => [item.id, item]));
  const relatedIds = [trackerProfile?.prev_launch_id, trackerProfile?.next_launch_id].filter(Boolean);
  let relatedLaunches = relatedIds
    .map((relatedId, index) => {
      const relatedLaunch = previewLookup.get(relatedId);
      if (!relatedLaunch) return null;
      return buildPreview(relatedLaunch, index === 0 ? 'Previous mission' : 'Next mission');
    })
    .filter(Boolean);

  if (relatedLaunches.length === 0) {
    const currentIndex = orderedLaunches.findIndex((item) => item.id === launchId);

    if (currentIndex > 0) {
      relatedLaunches.push(buildPreview(orderedLaunches[currentIndex - 1], 'Previous mission'));
    }

    if (currentIndex >= 0 && currentIndex < orderedLaunches.length - 1) {
      relatedLaunches.push(buildPreview(orderedLaunches[currentIndex + 1], 'Next mission'));
    }
  }

  return {
    launch,
    trackerProfile,
    relatedLaunches,
  };
}

export default async function LaunchDetailPage({ params }) {
  const launchId = params?.launchId;

  if (!launchId) {
    notFound();
  }

  const context = await loadLaunchTrackerContext(launchId).catch((error) => {
    console.error('[launch tracker] load error:', error.message);
    return null;
  });

  if (!context?.launch) {
    notFound();
  }

  return <LaunchTrackerView launch={context.launch} trackerProfile={context.trackerProfile} relatedLaunches={context.relatedLaunches} />;
}
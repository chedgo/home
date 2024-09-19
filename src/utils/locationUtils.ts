export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d * 0.621371;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function parseDuration(duration: string): number {
  const units = {
    'day': 24 * 60 * 60 * 1000,
    'week': 7 * 24 * 60 * 60 * 1000,
    'month': 30 * 24 * 60 * 60 * 1000,
    'year': 365 * 24 * 60 * 60 * 1000
  };

  const match = duration.match(/^(\d+)\s*([a-z]+)$/i);
  if (match) {
    const amount = parseInt(match[1]);
    const unit = match[2].toLowerCase() as keyof typeof units;
    if (unit in units) {
      return amount * units[unit];
    }
  }
  return 0;
}
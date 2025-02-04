import { db } from './database';

interface RoomPreference {
  type: 'single' | 'double' | 'triple';
  floor?: number;
  nearFacilities?: string[];
  maxPrice?: number;
}

export async function findOptimalRoom(studentId: string, preferences: RoomPreference) {
  // Implement room matching algorithm using student preferences and room availability
  const availableRooms = await db.rooms.getRooms();
  
  // Score each room based on preferences
  const scoredRooms = availableRooms.map(room => ({
    ...room,
    score: calculateRoomScore(room, preferences),
  }));

  // Return best match
  return scoredRooms.sort((a, b) => b.score - a.score)[0];
}

function calculateRoomScore(room: any, preferences: RoomPreference): number {
  let score = 0;
  
  // Match room type
  if (room.type === preferences.type) score += 100;
  
  // Consider floor preference
  if (preferences.floor && room.floor === preferences.floor) score += 50;
  
  // Consider proximity to facilities
  if (preferences.nearFacilities) {
    score += calculateFacilityScore(room, preferences.nearFacilities);
  }
  
  return score;
}

function calculateFacilityScore(room: any, facilities: string[]): number {
  // Simple scoring based on number of nearby facilities
  return facilities.reduce((score, facility) => {
    return score + (room.nearbyFacilities?.includes(facility) ? 25 : 0);
  }, 0);
} 
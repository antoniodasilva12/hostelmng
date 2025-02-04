export interface Student {
  id: string;
  name: string;
  roomNumber: string;
  checkInDate: string;
  status: 'checked-in' | 'checked-out';
  pendingRequests: number;
}

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'triple';
  occupancy: number;
  maxOccupancy: number;
  status: 'available' | 'occupied' | 'maintenance';
  currentOccupants: string[];
}

export interface MaintenanceRequest {
  id: string;
  roomNumber: string;
  type: 'repair' | 'cleaning' | 'general';
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
  read: boolean;
}
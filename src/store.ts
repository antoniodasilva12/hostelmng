import { create } from 'zustand';
import { Student, Room, MaintenanceRequest, Notification } from './types';

interface HostelStore {
  activeView: string;
  rooms: Room[];
  students: Student[];
  maintenanceRequests: MaintenanceRequest[];
  notifications: Notification[];
  
  setActiveView: (view: string) => void;
  allocateRoom: (roomId: string, studentId: string) => void;
  createMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateMaintenanceStatus: (requestId: string, status: MaintenanceRequest['status']) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  setNotifications: (notifications: Notification[]) => void;
  setMaintenanceRequests: (requests: MaintenanceRequest[]) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  setStudents: (students: Student[]) => void;
}

interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'triple';
  maxOccupancy: number;
  occupancy: number;
  status: 'available' | 'occupied' | 'maintenance';
  currentOccupants: string[];
}

export const useHostelStore = create<HostelStore>((set) => ({
  activeView: 'dashboard',
  rooms: [
    { id: '1', number: '101', type: 'single', occupancy: 0, maxOccupancy: 1, status: 'available', currentOccupants: [] },
    { id: '2', number: '102', type: 'double', occupancy: 1, maxOccupancy: 2, status: 'available', currentOccupants: ['4'] },
    { id: '3', number: '103', type: 'triple', occupancy: 2, maxOccupancy: 3, status: 'available', currentOccupants: ['5', '6'] },
  ],
  students: [
    { id: '1', name: 'John Doe', roomNumber: '', checkInDate: '', status: 'checked-out', pendingRequests: 0 },
    { id: '2', name: 'Jane Smith', roomNumber: '', checkInDate: '', status: 'checked-out', pendingRequests: 1 },
    { id: '3', name: 'Mike Johnson', roomNumber: '', checkInDate: '', status: 'checked-out', pendingRequests: 0 },
    { id: '4', name: 'Sarah Williams', roomNumber: '102', checkInDate: '2024-03-01', status: 'checked-in', pendingRequests: 0 },
    { id: '5', name: 'Tom Brown', roomNumber: '103', checkInDate: '2024-03-02', status: 'checked-in', pendingRequests: 1 },
    { id: '6', name: 'Emily Davis', roomNumber: '103', checkInDate: '2024-03-02', status: 'checked-in', pendingRequests: 0 },
  ],
  maintenanceRequests: [
    {
      id: '1',
      roomNumber: '102',
      type: 'repair',
      description: 'Broken light fixture',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-03-01T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z',
    },
    {
      id: '2',
      roomNumber: '103',
      type: 'cleaning',
      description: 'Regular cleaning required',
      status: 'completed',
      priority: 'low',
      createdAt: '2024-03-02T09:00:00Z',
      updatedAt: '2024-03-02T14:00:00Z',
    },
  ],
  notifications: [
    {
      id: '1',
      title: 'New Maintenance Request',
      message: 'Room 102 has reported a broken light fixture',
      type: 'warning',
      createdAt: '2024-03-01T10:00:00Z',
      read: false,
    },
  ],

  setActiveView: (view) => set({ activeView: view }),

  allocateRoom: (roomId, studentId) => set((state) => {
    const room = state.rooms.find(r => r.id === roomId);
    const student = state.students.find(s => s.id === studentId);
    
    if (!room || !student) return state;
    
    const updatedRooms = state.rooms.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          occupancy: r.occupancy + 1,
          status: r.occupancy + 1 >= r.maxOccupancy ? 'occupied' : 'available' as const,
          currentOccupants: [...r.currentOccupants, studentId],
        };
      }
      return r;
    });

    const updatedStudents = state.students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          roomNumber: room.number,
          checkInDate: new Date().toISOString().split('T')[0],
          status: 'checked-in',
        };
      }
      return s;
    });

    return {
      ...state,
      rooms: updatedRooms,
      students: updatedStudents,
    };
  }),

  createMaintenanceRequest: (request) => set((state) => ({
    ...state,
    maintenanceRequests: [
      ...state.maintenanceRequests,
      {
        ...request,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  })),

  updateMaintenanceStatus: (requestId, status) => set((state) => ({
    ...state,
    maintenanceRequests: state.maintenanceRequests.map(request =>
      request.id === requestId
        ? { ...request, status, updatedAt: new Date().toISOString() }
        : request
    ),
  })),

  addNotification: (notification) => set((state) => ({
    ...state,
    notifications: [
      ...state.notifications,
      {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        read: false,
      },
    ],
  })),

  markNotificationAsRead: (notificationId) => set((state) => ({
    ...state,
    notifications: state.notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ),
  })),

  setNotifications: (notifications) => set({ notifications }),

  setMaintenanceRequests: (maintenanceRequests) => set({ maintenanceRequests }),

  addStudent: (studentData) => set((state) => ({
    ...state,
    students: [
      ...state.students,
      {
        ...studentData,
        id: Date.now().toString(),
      },
    ],
  })),

  setStudents: (students) => set({ students }),
}));
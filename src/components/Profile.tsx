import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export function Profile() {
  const profile = useAuthStore((state) => state.profile);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <p className="mt-1 text-gray-900">{profile?.full_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{profile?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-gray-900 capitalize">{profile?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
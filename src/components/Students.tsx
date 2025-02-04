import { useState, useEffect } from 'react';
import { useHostelStore } from '../store';
import { Search, Download, UserPlus, Plus } from 'lucide-react';
import { Student } from '../types/room';
import { supabase } from '../lib/supabase';
import { exportFunctions } from '../utils/export';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: {
    name: string;
    email: string;
    phone: string;
    room_number: string | null;
    check_in_date: string | null;
    status: 'checked-in' | 'checked-out';
    pending_requests: number;
  }) => void;
}

function AddStudentModal({ isOpen, onClose, onSubmit }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    room_number: '',
    check_in_date: '',
    status: 'checked-out' as const,
    pending_requests: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      room_number: formData.room_number || null,
      check_in_date: formData.check_in_date || null
    });
    onClose();
    setFormData({
      name: '',
      email: '',
      phone: '',
      room_number: '',
      check_in_date: '',
      status: 'checked-out',
      pending_requests: 0
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add Student
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Students() {
  const { students, addStudent, setStudents } = useHostelStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data from Supabase
  useEffect(() => {
    async function loadStudents() {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching students from Supabase...');
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .order('name');

        if (error) throw error;

        console.log('Received students:', data);
        
        const transformedData = data.map(student => ({
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          room_number: student.room_number,
          check_in_date: student.check_in_date,
          status: student.status,
          pending_requests: student.pending_requests
        }));

        setStudents(transformedData);
      } catch (error) {
        console.error('Error loading students:', error);
        setError('Failed to load students. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, [setStudents]);

  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      console.log('Adding student to Supabase:', studentData);
      
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('students')
        .insert({
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          room_number: studentData.room_number || null,
          check_in_date: studentData.check_in_date || null,
          status: studentData.status,
          pending_requests: studentData.pending_requests,
          created_by: session.user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Student added successfully:', data);
      
      addStudent({
        ...studentData,
        id: data.id
      });

      setIsModalOpen(false);
      alert('Student added successfully!');
    } catch (error: any) {
      console.error('Error adding student:', error);
      alert(error.message || 'Failed to add student. Please try again.');
    }
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    try {
      // First, save to Supabase
      const { error } = await supabase
        .from('students')
        .upsert(
          students.map(student => ({
            ...student,
            updated_at: new Date().toISOString()
          }))
        );

      if (error) throw error;

      // Then export to file
      if (format === 'excel') {
        exportFunctions.toExcel(students, 'students_export');
      } else {
        exportFunctions.toPDF(students, 'students_export');
      }
    } catch (error) {
      console.error('Export failed:', error);
      // You might want to show an error notification here
    } finally {
      setIsExporting(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Students</h2>
        <div className="flex gap-2">
          <div className="relative group">
            <button
              disabled={isExporting}
              onClick={() => handleExport('excel')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
            >
              <Download className="h-5 w-5" />
              Export Excel
            </button>
          </div>
          <div className="relative group">
            <button
              disabled={isExporting}
              onClick={() => handleExport('pdf')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 disabled:opacity-50"
            >
              <Download className="h-5 w-5" />
              Export PDF
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            Add Student
          </button>
        </div>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pending Requests
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.room_number || 'Not assigned'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.status === 'checked-in' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.check_in_date || 'Not checked in'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.pending_requests}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStudent}
      />
    </div>
  );
} 
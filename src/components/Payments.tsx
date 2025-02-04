import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { CreditCard, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Phone } from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  payment_type: 'room_rent' | 'meal_plan' | 'maintenance' | 'security_deposit';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  description: string;
  payment_method?: string;
  transaction_date: string;
  due_date?: string;
}

interface MpesaResponse {
  CheckoutRequestID?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
  error?: string;
}

export function Payments() {
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPayment, setNewPayment] = useState<{
    amount: number;
    payment_type: 'room_rent' | 'meal_plan' | 'maintenance' | 'security_deposit';
    description: string;
  }>({
    amount: 0,
    payment_type: 'room_rent',
    description: ''
  });
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [processingMpesa, setProcessingMpesa] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([
          {
            user_id: user?.id,
            ...newPayment,
            status: 'pending',
            reference_id: `PAY-${Date.now()}`,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Simulate payment processing
      await processPayment(data.id);
      
      fetchPayments();
      setNewPayment({ amount: 0, payment_type: 'room_rent', description: '' });
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const processPayment = async (paymentId: string) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', paymentId);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleMpesaPayment = async () => {
    if (!mpesaNumber || !newPayment.amount) {
      alert('Please enter both phone number and amount');
      return;
    }

    setProcessingMpesa(true);
    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: mpesaNumber,
          amount: newPayment.amount,
          accountReference: user?.id
        }),
      });

      const data: MpesaResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.ResponseCode === '0') {
        // Create payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert([
            {
              user_id: user?.id,
              amount: newPayment.amount,
              payment_type: newPayment.payment_type,
              status: 'processing',
              payment_method: 'mpesa',
              reference_id: data.CheckoutRequestID,
              description: newPayment.description
            },
          ]);

        if (paymentError) throw paymentError;

        alert('Please check your phone to complete the M-PESA payment');
        setMpesaNumber('');
        setNewPayment({ amount: 0, payment_type: 'room_rent', description: '' });
      } else {
        throw new Error(data.ResponseDescription || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('M-PESA payment error:', error);
      alert(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setProcessingMpesa(false);
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" />;
      case 'failed':
        return <XCircle className="text-red-500" />;
      case 'pending':
        return <Clock className="text-yellow-500" />;
      default:
        return <AlertCircle className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Payment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Make a Payment</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })}
                  className="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Type</label>
              <select
                value={newPayment.payment_type}
                onChange={(e) => setNewPayment({ 
                  ...newPayment, 
                  payment_type: e.target.value as 'room_rent' | 'meal_plan' | 'maintenance' | 'security_deposit'
                })}
                className="mt-1 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="room_rent">Room Rent</option>
                <option value="meal_plan">Meal Plan</option>
                <option value="maintenance">Maintenance</option>
                <option value="security_deposit">Security Deposit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={newPayment.description}
                onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Payment description"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-3">Pay with M-PESA</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">M-PESA Phone Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={mpesaNumber}
                      onChange={(e) => setMpesaNumber(e.target.value)}
                      placeholder="254XXXXXXXXX"
                      className="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleMpesaPayment}
                  disabled={processingMpesa || !mpesaNumber || !newPayment.amount}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {processingMpesa ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Phone className="mr-2 h-5 w-5" />
                      Pay with M-PESA
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Process Payment
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <span className="ml-2 font-medium">${payment.amount}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(payment.transaction_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{payment.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Type: {payment.payment_type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
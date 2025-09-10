/*import { useState, useEffect } from 'react';
import axios from 'axios';

function OrderReviewerView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/purchaseorders/success-paid')
      .then(response => {
        if (response.data.success) {
          setOrders(response.data.data);
          setLoading(false);
        } else {
          setError('Failed to fetch orders');
          setLoading(false);
        }
      })
      .catch(err => {
        setError('Error connecting to backend: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading successful paid orders...</div>;
  if (error) return <div>Error: {error}. <button onClick={() => window.location.reload()}>Retry</button></div>;

  return (
    <div>
      <p>Total filtered orders: {orders.length}</p>
      {orders.length === 0 ? (
        <p>No successful paid orders to view.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>PO ID (Primary Key)</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Paid</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.po_id}>
                <td><strong>{order.po_id}</strong></td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>${order.total_amount.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{order.paid ? 'Yes' : 'No'}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderReviewerView;
*/


import { useState, useEffect } from 'react';
import axios from 'axios';

function OrderReviewerView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedPoId, setSelectedPoId] = useState(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');

  useEffect(() => {
    // Fetch filtered orders
    axios.get('http://localhost:5000/api/purchaseorders/success-paid')
      .then(response => {
        if (response.data.success) {
          setOrders(response.data.data);
          setLoading(false);
        } else {
          setError('Failed to fetch orders');
          setLoading(false);
        }
      })
      .catch(err => {
        setError('Error connecting to backend: ' + err.message);
        setLoading(false);
      });

    // Fetch all technicians for assignment
    axios.get('http://localhost:5000/api/employees')
      .then(response => {
        setTechnicians(response.data || []);
      })
      .catch(err => {
        console.error('Error fetching technicians:', err);
      });
  }, []);

  const handleAssign = async () => {
    if (!selectedPoId || !selectedTechnicianId) return;
    try {
      console.log('Sending:', { technicianId: selectedTechnicianId, poId: selectedPoId }); // Debug log
      const response = await axios.post('http://localhost:5000/api/employees/assign-to-po', {
        technicianId: selectedTechnicianId,
        poId: selectedPoId
      });
      alert('Technician assigned to PO ID: ' + selectedPoId);
      setSelectedPoId(null); // Close form
      // Refresh orders
      const newOrders = await axios.get('http://localhost:5000/api/purchaseorders/success-paid');
      if (newOrders.data.success) {
        setOrders(newOrders.data.data);
      }
    } catch (err) {
      alert('Assignment failed: ' + err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Loading successful paid orders...</div>;
  if (error) return <div>Error: {error}. <button onClick={() => window.location.reload()}>Retry</button></div>;

  return (
    <div>
      <p>Total filtered orders: {orders.length}</p>
      {orders.length === 0 ? (
        <p>No successful paid orders to view.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>PO ID (Primary Key)</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Paid</th>
              <th>Created At</th>
              <th>Assigned Technicians</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.po_id}>
                <td><strong>{order.po_id}</strong></td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>${order.total_amount.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{order.paid ? 'Yes' : 'No'}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{order.assigned_technicians.join(', ') || 'None'}</td>
                <td>
                  <button onClick={() => setSelectedPoId(order.po_id)}>Assign Technician</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedPoId && (
        <div>
          <h3>Assign to PO ID: {selectedPoId}</h3>
          <select value={selectedTechnicianId} onChange={(e) => setSelectedTechnicianId(e.target.value)}>
            <option value="">Select Technician</option>
            {technicians.map(tech => (
              <option key={tech._id} value={tech._id}>{tech.employee_name} (ID: {tech.employee_id})</option>
            ))}
          </select>
          <button onClick={handleAssign}>Submit</button>
          <button onClick={() => setSelectedPoId(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default OrderReviewerView;
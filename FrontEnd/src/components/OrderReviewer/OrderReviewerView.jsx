import { useState, useEffect } from 'react';
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
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./Admin.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const loadCustomers = async () => {
    try {
      const snapUsers = await getDocs(collection(db, "users"));
      const usersList = snapUsers.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const snapOrders = await getDocs(collection(db, "orders"));
      const ordersList = snapOrders.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const finalList = usersList.map((user) => {
        const userOrders = ordersList.filter((o) => o.userId === user.id);

        const lastOrder = userOrders.length
          ? Math.max(...userOrders.map((o) => o.createdAt))
          : null;

        return {
          ...user,
          totalOrders: userOrders.length,
          lastOrderDate: lastOrder
            ? new Date(lastOrder).toLocaleString()
            : "No orders",
        };
      });

      setCustomers(finalList);
    } catch (err) {
      console.error("Error loading customers:", err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="admin-customers-container">
      <h2 className="admin-title">👤 Customers</h2>

      {customers.length === 0 ? (
        <p className="no-customers">No customers found</p>
      ) : (
        <table className="admin-customers-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Orders</th>
              <th>Last Order</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="cust-user-box">
                    <div className="cust-avatar">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <strong>{user.name || "Unknown"}</strong>
                      <p className="cust-id">UID: {user.id}</p>
                    </div>
                  </div>
                </td>

                <td>{user.email || "Not added"}</td>
                <td>{user.phone || "Not added"}</td>

                <td>
                  <span className="badge-orders">{user.totalOrders}</span>
                </td>

                <td>
                  <span className="cust-last-order">
                    {user.lastOrderDate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Customers;

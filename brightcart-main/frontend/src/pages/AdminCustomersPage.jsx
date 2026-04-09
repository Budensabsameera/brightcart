import { useEffect, useState } from "react";
import Button from "../components/common/Button";
import { fetchAdminCustomers } from "../lib/api";
import { downloadCsv } from "../utils/csv";

const LOCAL_USERS_STORAGE_KEY = "brightcart.auth.users";

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchAdminCustomers()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setCustomers(Array.isArray(response) ? response : []);
        setError("");
      })
      .catch((requestError) => {
        if (!isMounted) {
          return;
        }

        const localCustomers = readLocalCustomers();
        setCustomers(localCustomers);
        setError(
          localCustomers.length > 0
            ? "Showing customer accounts saved in this browser."
            : requestError.message
        );
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    downloadCsv(
      "brightcart-customers.csv",
      [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "status", label: "Status" }
      ],
      customers
    );
  };

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <span className="section-kicker">Admin</span>
          <h1 className="admin-title">Manage customers</h1>
          <p className="admin-subtitle">
            Review registered shoppers and their account contact details.
          </p>
        </div>
      </div>

      <div className="admin-list-card">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Customers</span>
            <h3>{customers.length} customers</h3>
          </div>
          <Button variant="ghost" onClick={handleExport} disabled={customers.length === 0}>
            Export CSV
          </Button>
        </div>

        {loading ? <p className="admin-empty">Loading customers...</p> : null}
        {error ? (
          <p className={error.includes("saved in this browser") ? "auth-success admin-mode-banner" : "auth-error"}>
            {error}
          </p>
        ) : null}
        {!loading && !error && customers.length === 0 ? (
          <p className="admin-empty">No customers available yet.</p>
        ) : null}

        {!loading && customers.length > 0 ? (
          <div className="admin-customer-list">
            {customers.map((customer) => (
              <article key={customer.id} className="admin-customer-row">
                <div className="admin-customer-copy">
                  <strong>{customer.name}</strong>
                  <span>{customer.email}</span>
                </div>

                <div className="admin-customer-meta">
                  <div>
                    <span>Phone</span>
                    <strong>{customer.phone || "Not provided"}</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong>{customer.status}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function readLocalCustomers() {
  try {
    const savedUsers = window.localStorage.getItem(LOCAL_USERS_STORAGE_KEY);

    if (!savedUsers) {
      return [];
    }

    const parsedUsers = JSON.parse(savedUsers);
    if (!Array.isArray(parsedUsers)) {
      return [];
    }

    return parsedUsers
      .filter((user) => String(user.role ?? "user").toLowerCase() !== "admin")
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        status: "Local"
      }));
  } catch {
    return [];
  }
}

export default AdminCustomersPage;

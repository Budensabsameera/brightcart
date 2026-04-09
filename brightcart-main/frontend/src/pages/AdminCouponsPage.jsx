import { useEffect, useMemo, useState } from "react";
import Button from "../components/common/Button";
import { createCoupon, deleteCoupon, fetchAdminCoupons, updateCoupon } from "../lib/api";
import { readLocalCoupons, writeLocalCoupons } from "../lib/localCoupons";

const initialFormState = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderAmount: "",
  active: true
};

function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(() => readLocalCoupons());
  const [loading, setLoading] = useState(true);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("online");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headingText = useMemo(
    () => (editingCouponId ? "Edit coupon" : "Add coupon"),
    [editingCouponId]
  );

  useEffect(() => {
    let isMounted = true;

    fetchAdminCoupons()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const nextCoupons = Array.isArray(response) ? response.sort(compareCoupons) : [];
        setCoupons(nextCoupons);
        writeLocalCoupons(nextCoupons);
        setError("");
        setMode("online");
      })
      .catch((requestError) => {
        if (!isMounted) {
          return;
        }

        setCoupons(readLocalCoupons());
        setError(
          requestError.message === "Failed to fetch"
            ? "You are managing saved discount codes on this device."
            : requestError.message
        );
        setMode(requestError.message === "Failed to fetch" ? "local" : "online");
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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEdit = (coupon) => {
    setEditingCouponId(coupon.id);
    setFormState({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderAmount: String(coupon.minOrderAmount),
      active: Boolean(coupon.active)
    });
    setError("");
  };

  const resetForm = () => {
    setEditingCouponId(null);
    setFormState(initialFormState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = {
      ...formState,
      discountValue: Number(formState.discountValue),
      minOrderAmount: Number(formState.minOrderAmount)
    };

    try {
      if (editingCouponId) {
        const response = await updateCoupon(editingCouponId, payload);
        const nextCoupons = coupons
          .map((coupon) => (coupon.id === editingCouponId ? response : coupon))
          .sort(compareCoupons);
        setCoupons(nextCoupons);
        writeLocalCoupons(nextCoupons);
      } else {
        const response = await createCoupon(payload);
        const nextCoupons = [...coupons, response].sort(compareCoupons);
        setCoupons(nextCoupons);
        writeLocalCoupons(nextCoupons);
      }

      setMode("online");
      resetForm();
    } catch (requestError) {
      if (requestError.message === "Failed to fetch") {
        const fallbackCoupon = {
          id: editingCouponId ?? Date.now(),
          code: payload.code.trim().toUpperCase(),
          description: payload.description,
          discountType: payload.discountType,
          discountValue: payload.discountValue,
          minOrderAmount: payload.minOrderAmount,
          active: payload.active
        };
        const nextCoupons = editingCouponId
          ? coupons.map((coupon) => (coupon.id === editingCouponId ? fallbackCoupon : coupon)).sort(compareCoupons)
          : [...coupons, fallbackCoupon].sort(compareCoupons);
        setCoupons(nextCoupons);
        writeLocalCoupons(nextCoupons);
        setError(`Coupon ${editingCouponId ? "updated" : "saved"} on this device.`);
        setMode("local");
        resetForm();
      } else {
        setError(requestError.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (couponId) => {
    setError("");

    try {
      const nextCoupons = coupons.filter((coupon) => coupon.id !== couponId);
      await deleteCoupon(couponId);
      setCoupons(nextCoupons);
      writeLocalCoupons(nextCoupons);
      setMode("online");
    } catch (requestError) {
      if (requestError.message === "Failed to fetch") {
        const nextCoupons = coupons.filter((coupon) => coupon.id !== couponId);
        setCoupons(nextCoupons);
        writeLocalCoupons(nextCoupons);
        setError("Coupon removed on this device.");
        setMode("local");
      } else {
        setError(requestError.message);
      }
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <span className="section-kicker">Admin</span>
          <h1 className="admin-title">Manage coupons</h1>
          <p className="admin-subtitle">
            Create discount codes that affect cart totals, checkout, and order reporting.
          </p>
        </div>
      </div>

      <div className="admin-layout">
        <div className="admin-form-card">
          <h2>{headingText}</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <label className="auth-field">
                <span>Code</span>
                <input name="code" value={formState.code} onChange={handleChange} required />
              </label>

              <label className="auth-field">
                <span>Type</span>
                <select name="discountType" value={formState.discountType} onChange={handleChange}>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed</option>
                </select>
              </label>

              <label className="auth-field">
                <span>Value</span>
                <input
                  type="number"
                  name="discountValue"
                  value={formState.discountValue}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </label>

              <label className="auth-field">
                <span>Minimum Order</span>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formState.minOrderAmount}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </label>
            </div>

            <label className="auth-field">
              <span>Description</span>
              <textarea
                name="description"
                value={formState.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </label>

            <label className="coupon-toggle">
              <input
                type="checkbox"
                name="active"
                checked={formState.active}
                onChange={handleChange}
              />
              <span>Coupon is active</span>
            </label>

            {error ? (
              <p className={mode === "local" && !error.includes("could not") ? "auth-success admin-mode-banner" : "auth-error"}>
                {error}
              </p>
            ) : null}

            <div className="admin-form-actions">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingCouponId ? "Update Coupon" : "Add Coupon"}
              </Button>
              {editingCouponId ? (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="admin-list-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Coupons</span>
              <h3>{coupons.length} codes</h3>
            </div>
          </div>

          {loading ? <p className="admin-empty">Loading coupons...</p> : null}

          <div className="admin-product-list">
            {coupons.map((coupon) => (
              <article key={coupon.id} className="admin-product-row">
                <div className="admin-product-copy">
                  <strong>{coupon.code}</strong>
                  <span>{formatCouponMeta(coupon)}</span>
                  <small>{coupon.description}</small>
                </div>

                <div className="admin-product-actions">
                  <span className={`admin-stock-badge${coupon.active ? "" : " admin-stock-badge-muted"}`}>
                    {coupon.active ? "Active" : "Paused"}
                  </span>
                  <button type="button" className="admin-link-button" onClick={() => handleEdit(coupon)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-link-button admin-link-danger"
                    onClick={() => handleDelete(coupon.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function compareCoupons(left, right) {
  return left.code.localeCompare(right.code);
}

function formatCouponMeta(coupon) {
  const discountLabel =
    coupon.discountType === "PERCENTAGE"
      ? `${coupon.discountValue}% off`
      : `Rs. ${coupon.discountValue} off`;

  return `${discountLabel} · Min Rs. ${coupon.minOrderAmount}`;
}

export default AdminCouponsPage;

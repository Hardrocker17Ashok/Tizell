import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import "./Address.css";

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loadingPin, setLoadingPin] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    district: "",
    state: "",
    isPrimary: false,
  });

  // -------------------------------------------------------
  // 📌 LOAD ALL ADDRESSES FROM users/{uid}
  // -------------------------------------------------------
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!auth.currentUser) return;

      const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));

      if (userSnap.exists()) {
        const data = userSnap.data();
        setAddresses(data.addresses || []);
      }
    };

    fetchAddresses();
  }, []);

  // -------------------------------------------------------
  // 📌 INDIAN PHONE VALIDATION
  // -------------------------------------------------------
  const validatePhone = (phone) => {
    phone = phone.trim();

    // 1. Must be exactly 10 digits
    if (!/^[0-9]{10}$/.test(phone)) {
      return { valid: false, reason: "Phone must be 10 digits." };
    }

    // 2. Must start with 6-9 (Indian mobile rule)
    if (!/^[6-9]/.test(phone)) {
      return { valid: false, reason: "Phone must start with 6, 7, 8, or 9." };
    }

    // 3. Reject all repeated digits (1111111111)
    if (/^(.)\1{9}$/.test(phone)) {
      return { valid: false, reason: "Repeated digits not allowed." };
    }

    // 4. Reject common fake numbers
    const blacklist = [
      "1234567890",
      "0123456789",
      "9876543210",
      "0000000000",
      "9999999999",
      "8888888888",
      "7777777777",
      "6666666666"
    ];

    if (blacklist.includes(phone)) {
      return { valid: false, reason: "This phone number looks fake." };
    }

    // 5. Reject ascending sequences (2345678901)
    const ascending = "01234567890123456789";
    if (ascending.includes(phone)) {
      return { valid: false, reason: "Sequential numbers are invalid." };
    }

    // 6. Reject descending sequences (9876543210)
    const descending = "98765432109876543210";
    if (descending.includes(phone)) {
      return { valid: false, reason: "Reverse sequential numbers are invalid." };
    }

    // 7. Reject phone number if any digit repeats more than 5 times
    const counts = {};
    for (let digit of phone) {
      counts[digit] = (counts[digit] || 0) + 1;
      if (counts[digit] >= 6) {
        return { valid: false, reason: "Too many repeated digits." };
      }
    }

    // 8. Very strong final validation
    return { valid: true, reason: "Valid Indian phone number." };
  };


  // -------------------------------------------------------
  // 📌 VERIFY PINCODE
  // -------------------------------------------------------
  const verifyPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    try {
      setLoadingPin(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      setLoadingPin(false);

      if (data[0].Status === "Success") {
        const post = data[0].PostOffice[0];

        setNewAddress((prev) => ({
          ...prev,
          district: post.District,
          state: post.State,
        }));
      } else {
        alert("Invalid Pincode");
        setNewAddress((prev) => ({
          ...prev,
          district: "",
          state: "",
        }));
      }
    } catch (err) {
      setLoadingPin(false);
      alert("Pincode lookup failed");
    }
  };

  // -------------------------------------------------------
  // ⭐ SET PRIMARY ADDRESS IN users/{uid}.addresses[]
  // -------------------------------------------------------
  const setPrimaryAddress = async (id) => {
  // Step 1: update flags
  const updated = addresses.map((a) =>
    a.id === id ? { ...a, isPrimary: true } : { ...a, isPrimary: false }
  );

  // Step 2: move primary to top
  const primary = updated.find((a) => a.id === id);
  const others = updated.filter((a) => a.id !== id);
  const sorted = [primary, ...others];

  // Step 3: save sorted list in Firestore
  await setDoc(
    doc(db, "users", auth.currentUser.uid),
    { addresses: sorted },
    { merge: true }
  );

  // Step 4: update UI
  setAddresses(sorted);
};


  // -------------------------------------------------------
  // ⭐ DELETE ADDRESS FROM ARRAY
  // -------------------------------------------------------
  const deleteAddress = async (id) => {
    const updated = addresses.filter((a) => a.id !== id);

    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      { addresses: updated },
      { merge: true }
    );

    setAddresses(updated);
  };

  // -------------------------------------------------------
  // 📌 SAVE ADDRESS → users/{uid}.addresses[]
  // -------------------------------------------------------
  const saveAddress = async () => {
    const { name, phone, address, pincode, district, state } = newAddress;

    if (!name.trim()) return alert("Enter full name");
    if (!validatePhone(phone)) return alert("Enter valid phone number");
    if (pincode.length !== 6) return alert("Invalid pincode");
    if (!district || !state) return alert("Invalid pincode");
    if (!address.trim()) return alert("Enter full address");

    const id = crypto.randomUUID();

    const isPrimary = addresses.length === 0 ? true : false;

    const updated = [...addresses, { ...newAddress, id, isPrimary }];

    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      { addresses: updated },
      { merge: true }
    );

    setAddresses(updated);
  

    setNewAddress({
      name: "",
      phone: "",
      address: "",
      pincode: "",
      district: "",
      state: "",
      isPrimary: false,
    });
  };

  return (
    <div className="addr-container">
      <h2>Saved Addresses</h2>

      {addresses.map((a) => (
        <div className="addr-box" key={a.id}>
          <p><b>{a.name}</b></p>
          <p>{a.address}</p>
          <p>{a.district}, {a.state} - {a.pincode}</p>
          <p>Phone: {a.phone}</p>

          {a.isPrimary ? (
            <p className="primary-label">✔ Primary Address</p>
          ) : (
            <button className="set-primary" onClick={() => setPrimaryAddress(a.id)}>
              Set as Primary
            </button>
          )}

          <button className="delete-btn" onClick={() => deleteAddress(a.id)}>
            Delete
          </button>
        </div>
      ))}

      <h3>Add New Address</h3>

      <input
        placeholder="Full Name"
        value={newAddress.name}
        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
      />

      <input
        placeholder="Phone"
        maxLength={10}
        value={newAddress.phone}
        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
      />

      <input
        placeholder="Pincode"
        maxLength={6}
        value={newAddress.pincode}
        onChange={(e) => {
          const pin = e.target.value;
          setNewAddress({ ...newAddress, pincode: pin });
          if (pin.length === 6) verifyPincode(pin);
        }}
      />

      <input
        placeholder="State"
        value={newAddress.state}
        readOnly
        style={{ background: "#eaeaea" }}
      />

      <input
        placeholder="District"
        value={newAddress.district}
        readOnly
        style={{ background: "#eaeaea" }}
      />

      <textarea
        placeholder="Full Address"
        value={newAddress.address}
        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
      />

      <button className="addr-btn" onClick={saveAddress}>
        {loadingPin ? "Validating..." : "Save Address"}
      </button>
    </div>
  );
};

export default AddressPage;

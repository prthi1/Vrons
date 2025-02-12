import React, { useState } from "react";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const Form = ({ userId }) => {
  const [formData, setFormData] = useState({});
  const [isDraft, setIsDraft] = useState(false);

  const handleSave = async () => {
    await setDoc(doc(db, "forms", userId), { ...formData, status: "draft" });
    alert("Form saved as draft!");
  };

  const handleSubmit = async () => {
    await setDoc(doc(db, "forms", userId), { ...formData, status: "submitted" });
    alert("Form submitted!");
    // Trigger email sending (use Cloud Functions)
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Field 1"
        onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
      />
      <button onClick={handleSave}>Save Draft</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Form;
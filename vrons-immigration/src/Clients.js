import { useLocation } from "react-router-dom";

const Clients = () => {
  const location = useLocation();
  const user = location.state?.user;

  if (!user) {
    return <p style={{ textAlign: "center", color: "#e53e3e" }}>User not found.</p>;
  }

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        margin: "2rem auto",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          marginBottom: "1rem",
          color: "#4a5568",
        }}
      >
        User Details
      </h2>
      <p><strong>First Name:</strong> {user.firstName}</p>
      <p><strong>Last Name:</strong> {user.lastName}</p>
      <p><strong>Passport Number:</strong> {user.passportNumber}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
};

export default Clients;

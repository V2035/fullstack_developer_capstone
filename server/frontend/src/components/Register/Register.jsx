import React, { useState } from "react";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ username: "", first_name: "", last_name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.detail || "Registration failed.");
      setMessage("Registration successful. You can now log in.");
      setForm({ username: "", first_name: "", last_name: "", email: "", password: "" });
    } catch (error) {
      setMessage(error.message || "Unable to register. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Create an Account</h1>
        <p>Register to share your dealership experience.</p>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" value={form.username} onChange={handleChange} required />
        <label htmlFor="first_name">First Name</label>
        <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required />
        <label htmlFor="last_name">Last Name</label>
        <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" minLength="8" value={form.password} onChange={handleChange} required />
        <button type="submit" disabled={busy}>{busy ? "Registering..." : "Register"}</button>
        <p role="status" aria-live="polite">{message}</p>
      </form>
    </main>
  );
}

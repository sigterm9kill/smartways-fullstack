import { useEffect, useState } from 'react';

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  // Load contacts on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/contacts')
      .then(res => res.json())
      .then(data => setContacts(data))
      .catch(err => console.error('Error fetching contacts:', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch('http://localhost:3001/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const res = await fetch('http://localhost:3001/api/contacts');
      const data = await res.json();
      setContacts(data);
      setForm({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error submitting contact:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch('http://localhost:3001/api/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${id}`
      });

      const res = await fetch('http://localhost:3001/api/contacts');
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">📒 Contact Manager</h1>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Contact
        </button>
      </form>

      <ul className="space-y-2">
        {contacts.map(contact => (
          <li key={contact.id} className="border p-4 flex justify-between items-center">
            <div>
              <strong>{contact.name}</strong> <br />
              📧 {contact.email} <br />
              📞 {contact.phone}
            </div>
            <button
              onClick={() => handleDelete(contact.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


# 🧰 Full Stack Boilerplate: React + PHP + Flat File API (No XAMPP, MySQL, or Docker)

**Environment**:  
- VS Code (Linux or WSL – Oracle Linux 9)  
- Node + PHP CLI  
- No Apache, MySQL, phpMyAdmin, or containers required

---

## 📦 Project Goal

Build a working contact manager application using:

- React frontend (Vite)
- PHP backend (via built-in CLI server)
- Simulated MySQL backend using a flat JSON file

---

## ✅ What You Will Build

A working contact manager with:

- View/Add/Delete contacts  
- Flat-file persistence (no database required)  
- Frontend: `http://localhost:5173`  
- Backend API: `http://localhost:8000/contacts.php`

---

## 📁 Directory Layout

```
smartways-fullstack/
├── client/              # React (Vite)
├── server/
│   └── api/
│       ├── contacts.php # PHP API logic
│       └── contacts.json # Fake DB
└── README or tutorial.md (this doc)
```

---

## 🔧 Step-by-Step Setup

### 1. Create Project Structure

```bash
mkdir smartways-fullstack && cd smartways-fullstack
npm create vite@latest client -- --template react
cd client && npm install && cd ..
mkdir -p server/api
touch server/api/contacts.php
touch server/api/contacts.json
```

---

### 2. Add Starter JSON DB

`server/api/contacts.json`:

```json
[]
```

---

### 3. PHP API: `server/api/contacts.php`

```php
<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

define('DB_FILE', __DIR__ . '/contacts.json');

if (!file_exists(DB_FILE)) {
    file_put_contents(DB_FILE, json_encode([]));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $contacts = json_decode(file_get_contents(DB_FILE), true);
    echo json_encode($contacts);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $contacts = json_decode(file_get_contents(DB_FILE), true);

    $new = [
        'id' => time(),
        'name' => $data['name'] ?? '',
        'email' => $data['email'] ?? '',
        'phone' => $data['phone'] ?? ''
    ];

    $contacts[] = $new;
    file_put_contents(DB_FILE, json_encode($contacts, JSON_PRETTY_PRINT));
    echo json_encode(['message' => 'Contact added']);
    exit;
}

if ($method === 'DELETE') {
    parse_str(file_get_contents("php://input"), $params);
    $id = $params['id'] ?? 0;

    $contacts = json_decode(file_get_contents(DB_FILE), true);
    $contacts = array_filter($contacts, fn($c) => $c['id'] != $id);
    file_put_contents(DB_FILE, json_encode(array_values($contacts), JSON_PRETTY_PRINT));
    echo json_encode(['message' => 'Contact deleted']);
    exit;
}
```

---

### 4. Run the PHP Server

```bash
cd server/api
php -S localhost:8000
```

Visit in browser:  
**http://localhost:8000/contacts.php**  
✅ Should show `[]`

---

### 5. Replace `client/src/App.jsx` with React App

```jsx
import { useEffect, useState } from 'react';

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetch('http://localhost:8000/contacts.php')
      .then(res => res.json())
      .then(data => setContacts(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8000/contacts.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const res = await fetch('http://localhost:8000/contacts.php');
    const data = await res.json();
    setContacts(data);
    setForm({ name: '', email: '', phone: '' });
  };

  const handleDelete = async (id) => {
    await fetch('http://localhost:8000/contacts.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `id=${id}`
    });
    const res = await fetch('http://localhost:8000/contacts.php');
    const data = await res.json();
    setContacts(data);
  };

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">📒 Contact Manager</h1>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 w-full" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Contact</button>
      </form>
      <ul className="space-y-2">
        {contacts.map(contact => (
          <li key={contact.id} className="border p-4 flex justify-between items-center">
            <div>
              <strong>{contact.name}</strong><br />
              📧 {contact.email}<br />
              📞 {contact.phone}
            </div>
            <button onClick={() => handleDelete(contact.id)} className="text-red-600 hover:underline">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

---

## ✅ Done! You’ve Built a Full Stack Simulated App in VS Code with No Database.

```plaintext
Frontend: http://localhost:5173
Backend:  http://localhost:8000/contacts.php
```

Edit `contacts.json` manually to simulate external changes or restart with an empty file.

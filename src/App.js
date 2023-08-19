import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [list, setList] = useState([]);

  const [newUser, setNewUser] = useState({ name: "", email: "" });

  const myref = useRef();

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => setList(response.data))
      .catch((error) => alert(`${error}`));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setNewUser((prev) => ({ ...prev, [name]: value }));

    console.log(newUser);
  }

  function handleCreate() {
    axios
      .post("https://jsonplaceholder.typicode.com/users", newUser)
      .then((response) => {
        // Update the list of users with the new user
        setList([...list, response.data]);

        // Clear the new user form
        setNewUser({ name: "", email: "" });
      })
      .catch((error) => alert(`${error}`));
  }

  const [editingIndex, setEditingIndex] = useState(-1); // Keep track of the editing index

  function handleEdit(index) {
    myref.current.focus();
    setEditingIndex(index);
    const userToEdit = list[index];
    setNewUser({ name: userToEdit.name, email: userToEdit.email });
  }

  function handleUpdate(index) {
    if (newUser.name == "") {
      alert("Edit The User First");
      return;
    }
    const editedUser = {
      ...list[index],
      name: newUser.name,
      email: newUser.email,
    };

    axios
      .put(
        `https://jsonplaceholder.typicode.com/users/${editedUser.id}`,
        editedUser
      )
      .then(() => {
        const updatedList = [...list];
        updatedList[index] = editedUser;
        setList(updatedList);
        setEditingIndex(-1); // Reset the editing index
        setNewUser({ name: "", email: "" });
      })
      .catch((error) => alert(`${error}`));
  }

  function handleDelete(index) {
    const userToDelete = list[index];

    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${userToDelete.id}`)
      .then(() => {
        const updatedList = list.filter((_, i) => i !== index);
        setList(updatedList);
      })
      .catch((error) => alert(`${error}`));
  }

  return (
    <div className="app">
      <div className="create">
        <input
          ref={myref}
          value={newUser.name}
          onChange={handleChange}
          name="name"
          placeholder="Enter the Name"
        ></input>
        <input
          value={newUser.email}
          onChange={handleChange}
          name="email"
          placeholder="Enter the Email"
        ></input>
        <button onClick={handleCreate}> Create</button>
      </div>

      <table className="table">
        <tr>
          <th> Name</th>
          <th> Email</th>
        </tr>

        {list.map((ele, index) => (
          <tr className="user">
            <td>{ele.name}</td>
            <td>{ele.email}</td>
            <button onClick={() => handleDelete(index)}>delete</button>
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleUpdate(index)}>Update</button>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;

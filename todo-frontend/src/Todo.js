import { useEffect, useState } from "react";

export default function Todo() {
  // state value for title, function to make state value
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(-1);

  // Edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  const handleSubmit = () => {
    setError(""); // reset error message

    // check inputs
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            // add item to list
            setTodos([...todos, { title, description }]);
            setTitle(""); // reset title
            setDescription(""); // reset description
            setMessage("Item added successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            // set error message
            setError("Unable to create Todo item");
          }
        })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    }
  };

  // handle edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  // handleUpdate
  const handleUpdate = () => {
    setError(""); // reset error message

    // check inputs
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            // Update item to list
            const updatedTodos = todos.map((item) => {
              if (item._id === editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            });

            setTodos(updatedTodos);
            setEditTitle(""); // reset editTitle
            setEditDescription(""); // reset editDescription
            setMessage("Item updated successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
            setEditId(-1); // reset editId
          } else {
            // set error message
            setError("Unable to Update Todo item");
          }
        })
        .catch(() => {
          setError("Unable to Update Todo item");
        });
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
    // setEditTitle("");
    // setEditDescription("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            // remove item from list
            const updatedTodos = todos.filter((item) => item._id !== id);
            setTodos(updatedTodos);
            setMessage("Item deleted successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            // set error message
            setError("Unable to delete Todo item");
          }
        })
        .catch(() => {
          setError("Unable to delete Todo item");
        });
    }
  };

  // hooks
  useEffect(() => {
    getItems();
  }, []);

  // get all items
  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>ToDo Project with MERN stack</h1>
      </div>

      {/* creation todo item */}
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
          ></input>
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
          ></input>
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>

      <div className="row">
        <h3>Tasks</h3>
        <div className="col-md-6">
          <ul className="list-group">
            {todos.map((item) => (
              <li className="list-group-item d-flex justify-content-between bg-info align-items-center">
                <div className="d-flex flex-column me-2">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <span className="fw-bold">{item.title}</span>
                      <span>{item.description}</span>
                    </>
                  ) : (
                    <>
                      <div className="form-group d-flex gap-2">
                        <input
                          placeholder="Title"
                          onChange={(e) => setEditTitle(e.target.value)}
                          value={editTitle}
                          className="form-control"
                        ></input>
                        <input
                          placeholder="Description"
                          onChange={(e) => setEditDescription(e.target.value)}
                          value={editDescription}
                          className="form-control"
                        ></input>
                      </div>
                    </>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId === -1 || editId !== item._id ? (
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button className="btn btn-warning" onClick={handleUpdate}>
                      Update
                    </button>
                  )}
                  {editId === -1 ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

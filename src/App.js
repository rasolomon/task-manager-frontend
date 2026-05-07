import { useEffect, useState } from "react";

/*
TODO:  Eventually, you’ll want to mentally break App.js into 4 sections:

State → useState variables (your data)
API functions → fetch/add/delete/update
Lifecycle → useEffect loading initial data
JSX UI → what gets rendered on screen

Once you see those 4 buckets, React stops feeling like random magic and starts feeling systematic. Honestly, you’re already much closer than you think because you’ve been wiring real backend behavior into it all night.
*/

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Add New Task
  const addTask = () => {
    fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newTask,
        description: newTask,
        completed: false
      })
    }).then(() => {
      loadTasks();
      setNewTask("");
    });
  };

  // Complete Task
  const completeTask = (id) => {
    fetch(`http://localhost:8080/tasks/${id}/complete`, {
      method: "PATCH"
    }).then(() => loadTasks());
  };

  // Update Task
  const updateTask = (task) => {
    const updatedDescription = prompt(
      "Update task:",
      task.description
    );

    if (!updatedDescription) return;

    fetch(`http://localhost:8080/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...task,
        description: updatedDescription
      })
    }).then(() => loadTasks());
  };

  // Delete Task
  const deleteTask = (id) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: "DELETE"
    }).then(() => loadTasks());
  };

  // Make Task Pending
  const makeTaskPending = (id) => {
    fetch(`http://localhost:8080/tasks/${id}/pending`, {
      method: "PATCH"
    }).then(() => loadTasks());
  };

  useEffect(() => {
    loadTasks();
  }, []);


  // Function to Reload Tasks
  const loadTasks = () => {
    fetch("http://localhost:8080/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  };

  // PAGE MARKUP SECTION:
  return (
    <div>
      <h1>Robert's Tasks</h1>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter task" />

      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.description} {task.completed ? "✅" : "❌"}
            &nbsp;&nbsp;<button onClick={() => updateTask(task)}>Edit</button>
            &nbsp;&nbsp;<button onClick={() => completeTask(task.id)}>Complete</button>
            &nbsp;&nbsp;<button onClick={() => makeTaskPending(task.id)}>Make Pending</button>
            &nbsp;&nbsp;<button onClick={() => deleteTask(task.id)}>  Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
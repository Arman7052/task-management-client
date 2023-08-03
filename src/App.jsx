import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Form from './Component/Form';
import useTasks from './hooks/useTasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allTasks, allTasksLoading, allTasksRefetch] = useTasks();

  useEffect(() => {
    setTasks(allTasks);
    setLoading(allTasksLoading);
  }, [allTasks, allTasksLoading]);

  const updateTaskStatus = async (taskId, newStatus) => {
    setLoading(true);
    const updatedTask = { ...tasks.find((task) => task._id === taskId), status: newStatus };

    const response = await fetch(`https://task-manager-server-roan.vercel.app/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    if (response.ok) {
      setLoading(false);  
      allTasksRefetch();
      // Display SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Task Updated',
        text: 'The task status has been updated successfully.',
      });
    } else {
      const error = new Error('Failed to update task status');
      setError(error.message);
      setLoading(false);
      allTasksRefetch();
      // Display SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  const handleDelete = (taskId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://task-manager-server-roan.vercel.app/api/tasks/${taskId._id}`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(data => {
            if (data.deletedCount > 0) {
              allTasksRefetch();
              Swal.fire(
                'Deleted!',
                `${taskId.title} : has been deleted.`,
                'success'
              )
            }
          })
      }
    })
  }

  return (
    <div className='container'>
      <h1>Task Manager</h1>
      <Form></Form>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div >
          <div>
            {tasks.map((task) => (
              <div className='divide' key={task._id}>
                <div className='taskRow'>
                  <h3>Title : {task.title}</h3>
                  <p>Description : {task.description}</p>
                  <p>Status: {task.status}</p>
                </div>
                <div className='taskRow'>
                  <button className='completes' onClick={() => updateTaskStatus(task._id, 'completed')}>Mark as Completed</button>
                  <button className='progress' onClick={() => updateTaskStatus(task._id, 'in progress')}>Mark as In Progress</button>
                  <button className='delete' onClick={() => handleDelete(task)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

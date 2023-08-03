import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import useTasks from "../hooks/useTasks";

const Form = () => {
    const [tasks, setTasks] = useState({ title: '', description: '', status: '' });
    const [allTasks, allTasksLoading, allTasksRefetch] = useTasks();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // setTasks(allTasks);
        setLoading(allTasksLoading);
    }, [allTasks, allTasksLoading]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTasks({ ...tasks, [name]: value });
    };

    const addTask = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://task-manager-server-roan.vercel.app/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tasks),
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            const data = await response.json();

            setTasks({ title: '', description: '', status: '' });
            setLoading(false);
            allTasksRefetch();

            // Display SweetAlert success message
            Swal.fire({
                icon: 'success',
                title: 'Task Added',
                text: `${tasks.title} :task has been added successfully` ,
            });
        } catch (error) {
            setError(error.message);
            setLoading(false);

            // Display SweetAlert error message
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    };

    return (
        <div className="container">
            <form onSubmit={addTask}>
                <input className="input"
                    type="text"
                    name="title"
                    placeholder="Task title"
                    value={tasks.title}
                    required
                    onChange={handleInputChange}
                />
                <input className="input"
                    type="text"
                    name="description"
                    placeholder="Task description"
                    value={tasks.description}
                    required
                    onChange={handleInputChange}
                />
              
               <div className="button-container">
               <button type="submit" className="button" >Add Task</button>
               </div>
            </form>
            
        </div>
    );
};

export default Form;

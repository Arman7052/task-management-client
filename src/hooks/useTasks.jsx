import { useQuery } from "@tanstack/react-query";

const useTasks = () => {
    const {data: allTasks = [], isLoading: Loading, refetch: refetch} = useQuery({
        queryKey: ['allTasks'],
        queryFn: async() => {
            const res = await fetch('https://task-manager-server-roan.vercel.app/api/tasks');
            return res.json();
        }
    })

    return [allTasks, Loading, refetch]
};

export default useTasks;
  
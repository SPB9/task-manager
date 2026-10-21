import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import TasksPage from './pages/Tasks/TasksPage';

const RoutesComponent = () => {
  return (
    <>
      <Routes>
        <Route index element={<TasksPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="*" element={<TasksPage />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
};

export default RoutesComponent;

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import RoutesComponent from './app.tsx';
import './index.css';

const MainApp = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center p-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">出错了</h2>
              <p className="text-slate-500">{error?.message || '未知错误'}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                重新加载
              </button>
            </div>
          </div>
        )}
      >
        <RoutesComponent />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')!).render(<MainApp />);

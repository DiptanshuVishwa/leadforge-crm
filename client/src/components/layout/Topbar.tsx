import { Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Topbar = () => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white dark:bg-dark-900 dark:border-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          {/* Topbar left area (optional search) */}
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-x-4">
            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:flex lg:flex-col lg:items-start">
              <span className="text-sm font-medium leading-6 text-gray-900 dark:text-white" aria-hidden="true">
                {user?.name}
              </span>
              <span className="text-xs leading-4 text-gray-500 dark:text-gray-400" aria-hidden="true">
                {user?.role === 'admin' ? 'Administrator' : 'Sales Representative'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

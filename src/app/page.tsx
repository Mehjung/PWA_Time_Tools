export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            PWA Time Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your all-in-one time management solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {/* Timer Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Timer</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Set timers for your tasks and stay focused
            </p>
          </div>

          {/* Clock Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">World Clock</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Track time across different time zones
            </p>
          </div>

          {/* Stopwatch Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Stopwatch</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Track elapsed time with precision
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built with Next.js and Tailwind CSS
          </p>
        </div>
      </main>
    </div>
  );
}

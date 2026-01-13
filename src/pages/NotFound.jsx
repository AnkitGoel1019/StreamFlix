const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <a 
        href="/" 
        className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound;

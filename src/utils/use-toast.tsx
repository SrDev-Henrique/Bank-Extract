export const useToast = () => {
  return {
    success: (message: string) => {
      return (
        <div className="bg-green-500 text-white p-4 rounded-md fixed top-5 right-5">
          <p>{message}</p>
        </div>
      );
    },
    error: (message: string) => {
      return (
        <div className="bg-red-500 text-white p-4 rounded-md fixed top-5 right-5">
          <p>{message}</p>
        </div>
      );
    },
  };
};


interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Cargando..." }: LoadingStateProps) => {
  return (
    <div className="min-h-screen bg-streaming-background flex items-center justify-center">
      <div className="animate-pulse bg-streaming-card rounded-lg p-8">
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;

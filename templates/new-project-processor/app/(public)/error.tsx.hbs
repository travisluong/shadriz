"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="border max-w-sm m-auto p-5 text-center rounded">
      <h2>Something went wrong!</h2>
      <p>Digest: {error.digest}</p>
      <button
        className="bg-primary text-primary-foreground p-2 rounded mt-2"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}

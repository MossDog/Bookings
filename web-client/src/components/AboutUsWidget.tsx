interface AboutUsWidgetProps {
  aboutUs?: string;
  isLoading: boolean;
}

export default function AboutUsWidget({
  aboutUs,
  isLoading,
}: AboutUsWidgetProps) {
  if (isLoading) {
    return <div className="skeleton h-24 w-full rounded-lg"></div>;
  }

  if (!aboutUs) {
    return (
      <div className="card bg-base-100 p-4">
        <h2 className="text-lg font-bold mb-2">About Us</h2>
        <p className="text-base-content/70 italic">
          This business hasn't provided information yet.
        </p>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 p-4">
      <h2 className="text-lg font-bold mb-2">About Us</h2>
      <p className="text-base-content/70">{aboutUs}</p>
    </div>
  );
}

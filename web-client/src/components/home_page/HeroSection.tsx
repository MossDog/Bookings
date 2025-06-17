export default function HeroSection() {
  return (
    <div className="hero bg-base-200 rounded-box mb-12 p-8">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Discover Local Businesses</h1>
          <p className="text-base-content/70 text-lg mb-6">
            Find and book services from trusted local businesses in your area
          </p>
          <div className="join w-full max-w-md bg-base-100 shadow-lg">
            <input
              className="input join-item input-bordered w-full"
              placeholder="Search by business name or category..."
            />
            <button className="btn join-item btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

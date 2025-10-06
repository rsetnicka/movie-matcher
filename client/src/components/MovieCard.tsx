const MovieCard = ({
  data,
  isPending,
  isError,
}: {
  data: {
    title: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    overview: string;
    trailerKey: string;
  };
  isPending: boolean;
  isError: boolean;
}) => {
  return (
    <div className="flex justify-center my-16 flex-shrink flex-grow">
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading data</div>
      ) : (
        <div
          className="flex w-2/3 flex-col rounded-xl bg-zinc-800 p-8 shadow-md
            ring-2 shadow-gray-500 ring-gray-400"
        >
          <h2 className="mb-2 text-2xl font-bold">{data.title}</h2>
          <p className="mb-1">
            <strong>Release Date:</strong> {data.release_date}
          </p>
          <p className="mb-1">
            <strong>Rating:</strong> {data.vote_average} ({data.vote_count}{" "}
            votes)
          </p>
          <p className="mt-2">{data.overview}</p>
          <div
            className="mt-8 max-w-full max-h-full aspect-video self-center
              flex-shrink flex-grow"
          >
            <iframe
              className="rounded-xl"
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${data.trailerKey}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-4 flex gap-4">
            <div
              className="flex h-16 flex-1 cursor-pointer items-center
                justify-center rounded-xl bg-red-700 text-4xl hover:bg-red-600"
            >
              👎
            </div>
            <div
              className="flex h-16 flex-1 cursor-pointer items-center
                justify-center rounded-xl bg-green-700 text-4xl
                hover:bg-green-600"
            >
              👍
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;

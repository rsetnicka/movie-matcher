import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search: { q?: string }) => search, // declare q param
});

type Movie = {
  id: number;
  title: string;
};

function Index() {
  const queryParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const queryTerm = queryParams.q ?? "";

  // const [search, setSearch] = React.useState(queryParams.q ?? "");
  // const [submittedSearch, setSubmittedSearch] = React.useState(
  //   queryParams.q ?? "",
  // );
  // const queryClient = useQueryClient();
  const { isPending, isError, data, error, isFetching } = useQuery({
    queryKey: ["movies", queryTerm],
    queryFn: () => fetchMovies(queryTerm),
    enabled: !!queryTerm,
    placeholderData: (prev) => prev,
  });

  function searchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("search") as string;
    navigate({ search: { q } });
  }
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <form onSubmit={searchSubmit} className="flex">
        <input
          type="text"
          name="search"
          defaultValue={queryTerm} // input reflects URL param
          placeholder="Search movies..."
          className="rounded border p-1"
        />
        <button
          className="ml-2 rounded bg-blue-500 p-1 text-white"
          type="submit"
        >
          Search
        </button>
      </form>

      <div className="mt-4">
        <h4>
          Search Results:
          {!isPending && isFetching && (
            <span className="text-gray-500"> Refreshing...</span>
          )}
        </h4>

        {/* Before any search → show nothing */}
        {!queryTerm && <div>Type a search and click Search</div>}

        {/* First ever search → no cached data yet */}
        {queryTerm && isPending && <div>Loading...</div>}

        {/* Error handling */}
        {isError && <div>Error: {(error as Error).message}</div>}

        {/* Show cached data immediately on next searches */}
        {data && (
          <>
            <ul>
              {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
              {data?.map((movie: Movie) => (
                <li key={movie.id}>
                  {movie.id} - {movie.title}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

const fetchMovies = async (q: string) => {
  const res = await fetch(
    `http://localhost:3001/api/movies?q=${encodeURIComponent(q)}`,
  );
  if (!res.ok) throw new Error("Network response was not ok");

  // Simulate a 1 second delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return res.json();
};

// const fetchMovie = async (id) => {
//   const res = await fetch(`http://localhost:3001/api/movie/${id}`, {
//     headers: {
//       Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
//     },
//   });
//   if (!res.ok) throw new Error("Network response was not ok");
//   return res.json();
// };

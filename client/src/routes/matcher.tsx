import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import GenresCard from "../components/GenresCard";
import MovieCard from "../components/MovieCard";

export const Route = createFileRoute("/matcher")({
  component: RouteComponent,
});

function RouteComponent() {
  const [step, setStep] = React.useState(1);
  const { isPending, isError, data } = useQuery({
    queryKey: ["matcherData"],
    queryFn: () => fetchMovie(157336), // Example movie ID // Interstellar 157336 Matrix 603
    enabled: step > 5,
  });

  const {
    isPending: genresIsPending,
    isError: genresIsError,
    data: genresData,
  } = useQuery({
    queryKey: ["genresData"],
    queryFn: fetchGenres,
  });

  function nextStep() {
    setStep((s) => s + 1);
  }

  return (
    <>
      {step === 1 && !genresIsPending && !genresIsError && (
        <GenresCard
          type="LikeGenres"
          onNext={nextStep}
          isPending={genresIsPending}
          isError={genresIsError}
          data={genresData}
        />
      )}
      {step === 2 && (
        <GenresCard
          type="DislikeGenres"
          onNext={nextStep}
          isPending={genresIsPending}
          isError={genresIsError}
          data={genresData}
        />
      )}
      {step > 5 && (
        <MovieCard data={data} isPending={isPending} isError={isError} />
      )}
    </>
  );
}

const fetchMovie = async (id: number) => {
  const res = await fetch(`http://localhost:3001/api/movie/${id}`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

const fetchGenres = async () => {
  const res = await fetch(`http://localhost:3001/api/genres`);
  if (!res.ok) throw new Error("Network response was not ok");
  console.log(res);
  return res.json();
};

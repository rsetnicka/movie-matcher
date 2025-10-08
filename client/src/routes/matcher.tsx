import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Genre } from "@/types/global";
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
  const [yearRange, setYearRange] = React.useState<[number, number]>([
    1990, 2025,
  ]);

  const { isPending, isError, data } = useQuery({
    queryKey: ["matcherData"],
    queryFn: () => fetchMovie(157336), // Example movie ID // Interstellar 157336 Matrix 603
    enabled: step >= 4,
  });

  const {
    isPending: genresIsPending,
    isError: genresIsError,
    data: genresData,
  } = useQuery({
    queryKey: ["genresData"],
    queryFn: async () => {
      const data = await fetchGenres();
      console.log("Fetched genres data:", data);
      const modifiedData = data.map((row: Genre) => ({
        ...row,
        preference: null,
      }));
      return modifiedData;
    },
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
          preference={"liked"}
          data={genresData}
        />
      )}
      {step === 2 && (
        <GenresCard
          type="DislikeGenres"
          onNext={nextStep}
          isPending={genresIsPending}
          isError={genresIsError}
          preference={"disliked"}
          data={genresData}
        />
      )}
      {step === 3 && (
        <div className="flex flex-shrink flex-grow flex-col items-center justify-center">
          <Label className="text-lg">
            Year: {yearRange[0]} – {yearRange[1]}
          </Label>
          <Slider
            value={yearRange}
            onValueChange={(value) => setYearRange([value[0], value[1]])}
            min={1940}
            max={2025}
            step={1}
            className="w-64 py-4"
          />
          <button
            className="cursor-pointer rounded-xl border bg-green-800 px-4 py-2 hover:bg-green-700"
            onClick={nextStep}
          >
            Next
          </button>
        </div>
      )}

      {step >= 4 && (
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

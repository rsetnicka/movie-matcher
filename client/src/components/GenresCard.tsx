import type { Genre } from "@/types/global";
import clsx from "clsx";
import React from "react";

type GenresCardProps = {
  type: "LikeGenres" | "DislikeGenres";
  onNext?: () => void;
  isPending: boolean;
  isError: boolean;
  preference: "liked" | "disliked" | null;
  data: Genre[];
};

const GenresCard = ({
  isPending,
  isError,
  data,
  type,
  preference,
  onNext,
}: GenresCardProps) => {
  const [genresData, setGenresData] = React.useState(data ?? []);
  console.log("GenresCard data:", genresData);
  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading genres</div>;

  function handleClick(id: number) {
    console.log("Clicked genre ID:", id);
    setGenresData((prev) =>
      prev.map((genre) => (genre.id === id ? { ...genre, preference } : genre)),
    );
  }

  return (
    <div className="my-16 flex flex-shrink flex-grow flex-col items-center justify-center">
      <h2
        className={clsx("m-4", {
          "text-green-500": type === "LikeGenres",
          "text-red-500": type === "DislikeGenres",
        })}
      >
        Genres you {type === "LikeGenres" ? "like" : "dislike"}
      </h2>
      <div className="mb-4 grid grid-cols-4 text-gray-400">
        {genresData.length > 0 &&
          genresData.map((genre) => (
            <div
              className={clsx(
                "mx-2 my-1 cursor-pointer rounded-xl p-2 text-center",
                "hover:bg-gray-700", // default styles
                {
                  "bg-green-700": genre.preference === "liked",
                  "bg-red-700": genre.preference === "disliked",
                  "bg-gray-800": !genre.preference,
                },
              )}
              key={genre.id}
              onClick={() => handleClick(genre.id)}
            >
              {genre.name}
            </div>
          ))}
      </div>
      <button
        className="cursor-pointer rounded-xl border bg-green-800 px-4 py-2 hover:bg-green-700"
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
};
export default GenresCard;

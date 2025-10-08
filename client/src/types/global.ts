export interface Genre {
  id: number;
  name: string;
  preference: "liked" | "disliked" | null;
}

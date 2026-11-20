import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { IResponseMovie } from "../type/IResponMovies";

type HoverState = {
  movie: IResponseMovie;
  top: number;
  left: number;
};

export function useMovieCardHover() {
  const [hover, setHover] = useState<HoverState | null>(null);

  const hoverRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement | null>(null);

  const handleCardEnter = (
    event: PointerEvent<HTMLDivElement>,
    movie: IResponseMovie,
  ) => {
    if (window.matchMedia("(hover: none)").matches) return;

    const card = event.currentTarget;
    activeCardRef.current = card;

    const rect = card.getBoundingClientRect();
    const hoverWidth = 320;
    const hoverHeight = 180;
    const margin = 12;

    const left = Math.max(
      margin,
      Math.min(
        rect.left + rect.width / 2 - hoverWidth / 2,
        window.innerWidth - hoverWidth - margin,
      ),
    );

    const top = Math.max(
      margin,
      Math.min(
        rect.top + rect.height / 2 - hoverHeight / 2,
        window.innerHeight - hoverHeight - margin,
      ),
    );

    setHover({ movie, top, left });
  };

  const handleCardLeave = (event: PointerEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;

    if (next instanceof Node && hoverRef.current?.contains(next)) {
      return;
    }

    setHover(null);
    activeCardRef.current = null;
  };

  const handleHoverLeave = (event: PointerEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;

    if (next instanceof Node && activeCardRef.current?.contains(next)) {
      return;
    }

    setHover(null);
    activeCardRef.current = null;
  };

  useEffect(() => {
    if (!hover) return;

    const closeHover = () => {
      setHover(null);
      activeCardRef.current = null;
    };

    window.addEventListener("scroll", closeHover, true);
    window.addEventListener("resize", closeHover);

    return () => {
      window.removeEventListener("scroll", closeHover, true);
      window.removeEventListener("resize", closeHover);
    };
  }, [hover]);

  return {
    hover,
    hoverRef,
    handleCardEnter,
    handleCardLeave,
    handleHoverLeave,
  };
}

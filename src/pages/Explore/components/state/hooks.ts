import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { ExploreState, ExploreDispatch } from "./store";

export const useExploreDispatch = () => useDispatch<ExploreDispatch>();
export const useExploreSelector: TypedUseSelectorHook<ExploreState> = useSelector;

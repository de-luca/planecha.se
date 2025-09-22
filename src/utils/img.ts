import type { Card } from "@/model/card";

export const buildImgSrc = (card: Card) => `/cards/${card.id}.jpg`;

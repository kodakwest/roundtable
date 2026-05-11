export type GuideQuestion = {
  id: string;
  prompt: string;
};

export type GuideSection = {
  title: string;
  context: string;
  questions: GuideQuestion[];
};

export type GuideLanding = {
  paragraph: string;
  finalQuestion: string;
};

export type GuideAnchorVerse = {
  reference: string;
  text: string;
};

export type Guide = {
  id: string;
  title: string;
  series: string;
  date: string;
  scriptureMap: string;
  anchorVerse: GuideAnchorVerse;
  theme: string;
  framingSentence: string;
  sections: GuideSection[];
  landing: GuideLanding;
  deeperDive?: string[];
};

export type SeriesMeta = {
  id: string;
  name: string;
  count: number;
};

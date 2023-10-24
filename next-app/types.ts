export type Argument = {
  arg_id: string;
  argument: string;
  comment_id: string;
  x: number;
  y: number;
  p: number;
};

export type CommentObj = {
  comment: string;
  agrees?: number;
  disagrees?: number;
  video?: string;
  interview?: string;
  timestamp?: string;
};

export type CommentsMap = {
  [id: string]: CommentObj;
};

export type Replacement = {
  replace: string;
  by: string;
};

export type Cluster = {
  cluster: string;
  cluster_id: string;
  takeaways?: string;
  arguments: Argument[];
};

export type Config = {
  name: string;
  question: string;
  intro?: string;
  translation: {
    languages: string[];
    flags: string[];
  };
  visualization: {
    replacements: Replacement[];
  };
};

export type Translations = {
  [id: string]: string[];
};

export type Result = {
  clusters: Cluster[];
  comments: CommentsMap;
  translations: Translations;
  config: Config;
  overview: string;
};

export type Dimensions = {
  width: number;
  height: number;
  padding: number;
  scaleX: (x: number) => number;
  scaleY: (y: number) => number;
};

export type Point = Argument & Cluster & CommentObj & { color: string };

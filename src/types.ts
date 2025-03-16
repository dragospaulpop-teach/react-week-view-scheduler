export type Event = {
  label: string;
  key: string;
  type: "lab" | "course" | "exam" | "break" | "other";
  room: string;
};

export type Header = {
  label: string;
  key: string;
};

export type Row = {
  [key: string]: {
    [key: string]: Event[];
  };
};

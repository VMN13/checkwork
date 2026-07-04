import React from "react";
import { TagCloud } from "react-tagcloud";

type TagItem = { value: string; count: number };

const data: TagItem[] = [
  { value: "JavaScript", count: 100 },
  { value: "TypeScript", count: 100 },
  { value: "React", count: 100 },
  { value: "Angular", count: 100 },
  { value: "Vue", count: 100 },
];

const colorOptions = {
  luminosity: "dark",
  hue: "blue",
};

const SimpleCloud: React.FC = () => {
  return (
    <TagCloud tags={data} minSize={12} maxSize={35} colorOptions={colorOptions} />
  );
};

export default SimpleCloud;

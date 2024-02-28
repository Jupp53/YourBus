import BusLine from "../models/busLine";

const data = [
  "1;Linia 1: Trzebunia-Myślenice",
  "2;Linia 2: Myślenice-Trzebunia",
];

export const BUSLINES = data.map((line) => {
  const [id, name] = line.split(";");
  return new BusLine(parseInt(id), name);
});

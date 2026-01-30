import { app, readData } from "../../index.js";

export function Statist() {
  app.get("/api/statist", (req,res) => {
    let data = readData();
    let statist = [...data.statist];
    res.json(statist);
  });
}

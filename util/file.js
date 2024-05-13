import path from "path";
import fs from "fs";

export const clearImage = (filePath) => {
  filePath = path.join(path.resolve("..", filePath));
  fs.unlink(filePath, (err) => console.log(err));
};

import * as fs from "fs-extra";
import * as path from "path";

const inputDirectory = "./texts";
const outputFilePath = "combined-text.txt";

async function combineTxtFiles(
  inputDir: string,
  outputFile: string
): Promise<void> {
  try {
    const files = await fs.readdir(inputDir);
    const txtFiles = files.filter((file) => file.endsWith(".txt"));

    let combinedContent = "";

    for (const txtFile of txtFiles) {
      const filePath = path.join(inputDir, txtFile);
      const fileContent = await fs.readFile(filePath, "utf-8");
      combinedContent += fileContent + "\n";
    }

    await fs.writeFile(outputFile, combinedContent, "utf-8");
    console.log(
      `All .txt files in ${inputDir} have been combined into ${outputFile}`
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

combineTxtFiles(inputDirectory, outputFilePath);

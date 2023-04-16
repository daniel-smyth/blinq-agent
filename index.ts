import console from "console";
import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { OpenAI } from "langchain/llms";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores";

export const main = async () => {
  const model = new OpenAI({ maxTokens: 1000, temperature: 0.1 });

  const text = fs.readFileSync("combined-text.txt", "utf8");
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);

  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
  const qaChain = VectorDBQAChain.fromLLM(model, vectorStore);

  const questions = [
    "Does Blinq have SOC2? When did they get it?",
    "What plans does Blinq have?",
    "How do I get more Blinq cards?",
    "What's Blinq's privacy policy?",
  ];

  const answers = await Promise.all(
    questions.map(async (question) => {
      const answer = await qaChain.call({
        input_documents: docs,
        query: "You are a chat bot for Blinq. " + question,
      });

      return "\n\n> " + question + "\n" + answer.text;
    })
  );

  console.log(answers.join("\n"));
};

main();

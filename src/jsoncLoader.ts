import { readConfigFile } from "typescript";

export const jsoncLoader = async (fileContent: string): Promise<object> => {
  // using the TypeScript compiler's API since it can parse jsonc without adding another dependency
  const { config, error } = readConfigFile("irrelevant", () => fileContent);
  if (error) throw new Error(JSON.stringify(error.messageText));

  return config;
};

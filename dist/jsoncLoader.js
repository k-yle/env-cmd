"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsoncLoader = void 0;
const typescript_1 = require("typescript");
exports.jsoncLoader = async (fileContent) => {
    // using the TypeScript compiler's API since it can parse jsonc without adding another dependency
    const { config, error } = typescript_1.readConfigFile("irrelevant", () => fileContent);
    if (error)
        throw new Error(JSON.stringify(error.messageText));
    return config;
};

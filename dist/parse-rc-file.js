"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRCFileVars = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const path_1 = require("path");
const utils_1 = require("./utils");
const jsoncLoader_1 = require("./jsoncLoader");
const statAsync = util_1.promisify(fs_1.stat);
const readFileAsync = util_1.promisify(fs_1.readFile);
const parserMapping = {
    '.jsonc': jsoncLoader_1.jsoncLoader,
    '.json': JSON.parse
};
/**
 * Gets the env vars from the rc file and rc environments
 */
async function getRCFileVars({ environments, filePath }) {
    const absolutePath = utils_1.resolveEnvFilePath(filePath);
    try {
        await statAsync(absolutePath);
    }
    catch (e) {
        const pathError = new Error(`Failed to find .rc file at path: ${absolutePath}`);
        pathError.name = 'PathError';
        throw pathError;
    }
    // Get the file extension
    const ext = path_1.extname(absolutePath).toLowerCase();
    let parsedData;
    try {
        if (ext === '.js' || ext === '.cjs') {
            parsedData = await Promise.resolve().then(() => require(absolutePath));
        }
        else {
            const file = await readFileAsync(absolutePath, { encoding: 'utf8' });
            if (ext in parserMapping)
                parsedData = await parserMapping[ext](file);
            else
                parsedData = JSON.parse(file);
        }
    }
    catch (e) {
        const parseError = new Error(`Failed to parse .rc file at path: ${absolutePath}`);
        parseError.name = 'ParseError';
        throw parseError;
    }
    // Parse and merge multiple rc environments together
    let result = {};
    let environmentFound = false;
    environments.forEach((name) => {
        const envVars = parsedData[name];
        if (envVars !== undefined) {
            environmentFound = true;
            result = Object.assign(Object.assign({}, result), envVars);
        }
    });
    if (!environmentFound) {
        const environmentError = new Error(`Failed to find environments [${environments.join(',')}] at .rc file location: ${absolutePath}`);
        environmentError.name = 'EnvironmentError';
        throw environmentError;
    }
    return result;
}
exports.getRCFileVars = getRCFileVars;

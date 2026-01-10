import dicetherEsLint from "@dicether/eslint-config";
import {defineConfig, globalIgnores} from "eslint/config";

import globals from "globals";

export default defineConfig([
    globalIgnores(["**/lib", "**/dist", "**/typings"]),
    dicetherEsLint,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
]);

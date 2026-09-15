import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:5000/graphql",
  documents: "src/graphql/**/*.graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
    },
  },
};

export default config;

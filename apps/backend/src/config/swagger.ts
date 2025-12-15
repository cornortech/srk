import { apiContract } from "@srk/shared/contracts";
import { generateOpenApi } from "@ts-rest/open-api";

const swaggerApiDocs = generateOpenApi(apiContract, {
  info: {
    title: "SRK Universtiry API",
    version: "1.0.0",
  },
});
export default swaggerApiDocs;
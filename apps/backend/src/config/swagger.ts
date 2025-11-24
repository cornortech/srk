import { generateOpenApi } from "@ts-rest/open-api";
import { contract } from "../contract";

const swaggerApiDocs = generateOpenApi(contract, {
  info: {
    title: "SRK Universtiry API",
    version: "1.0.0",
  },
});
export default swaggerApiDocs;
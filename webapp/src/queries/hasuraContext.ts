import { API_ADMIN_SECRET } from "../constants";

const hasura = {
  headers: { "x-hasura-admin-secret": API_ADMIN_SECRET },
};

export default hasura;

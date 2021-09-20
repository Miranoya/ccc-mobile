/* config */
export interface Config {
  readonly spotPostUrl: string;
  readonly allSpotGETUrl: string;
  readonly singleSpotGetUrl: string;
  readonly spotPatchUrl: string;
}

class ConfigClass implements Config {
  spotPostUrl = String(process.env.REACT_APP_SPOT_POST_URL);
  allSpotGETUrl = String(process.env.REACT_APP_ALL_SPOT_GET_URL);
  singleSpotGetUrl = String(process.env.REACT_APP_SINGLE_SPOT_GET_URL);
  spotPatchUrl = String(process.env.REACT_APP_SPOT_PATCH_URL);
}

const config = new ConfigClass();
export { config }

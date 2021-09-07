/* config */
export interface Config {
  readonly spotPostUrl: string;
  readonly allSpotGETUrl: string;
  readonly singleSpotGetUrl: string;
  readonly spotPatchUrl: string;
}

class ConfigClass implements Config {
  spotPostUrl = "https://esrnf6poie.execute-api.us-east-1.amazonaws.com/Mock/spot";
  allSpotGETUrl = "https://esrnf6poie.execute-api.us-east-1.amazonaws.com/Mock/spot"
  singleSpotGetUrl = "https://esrnf6poie.execute-api.us-east-1.amazonaws.com/Mock/spot/";
  spotPatchUrl = "https://esrnf6poie.execute-api.us-east-1.amazonaws.com/Mock/spot/";
}

const config = new ConfigClass();
export { config }

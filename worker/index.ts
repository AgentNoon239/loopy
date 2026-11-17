import { Container, getContainer } from "@cloudflare/containers";

export class MyContainer extends Container {
  defaultPort = 8000;
  sleepAfter = '10s';
}

export default {
  async fetch(request: any, env: any) {
    const container = getContainer(env.MY_CONTAINER);
    const response = await container.fetch(request);
    return response;
  }
};

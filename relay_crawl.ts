import { Command } from "@cliffy/command";
import { CredentialManager } from "@atcute/client";
import { XRPC } from "@atcute/client";
import { GlobalOpts } from "./types.ts";

export const requestCrawlCmd = new Command()
  .name("request-crawl")
  .description("Request a relay crawls your PDS.")
  .arguments("<...relays:string>")
  .action(async ({ server }: GlobalOpts, ...args: Array<string>) => {
    for (const host of args) {
      console.log(`🛜 Requesting crawl from relay ${host}...`);
      const manager = new CredentialManager({ service: `https://${host}` });
      const rpc = new XRPC({ handler: manager });

      try {
        await rpc.call('com.atproto.sync.requestCrawl', { data: { hostname: server } });
        console.log(`✅ Relay crawl request to ${host} successful!`);
      } catch(e) {
        console.error(`❌ Failed to send relay crawl request to ${host}:\n\n`, e);
      }
    }
  });

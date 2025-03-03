import { type ActionHandler, Command } from "@cliffy/command";
import { CredentialManager } from "@atcute/client";
import { XRPC } from "@atcute/client";
import type { GlobalOpts } from "../types";

export const deleteCmd = new Command()
  .name("delete")
  .option(
    "-d, --did <did:string>",
    "The DID of the account to delete.",
    {
      required: true,
    },
  )
  .description("Delete an account associated with the given PDS.")
  .action((async ({
    server,
    adminPassword,
    did,
  }: GlobalOpts & { did: string }) => {
    const manager = new CredentialManager({ service: `${server}` });
    const rpc = new XRPC({ handler: manager });
    const authStr = btoa(`admin:${adminPassword}`);

    try {
      console.log(`🛜 Requesting account deletion for ${did} on ${server}...`);

      await rpc.request({
        type: 'post',
        nsid: 'com.atproto.admin.deleteAccount',
        data: { did },
        headers: { 'Authorization': `Basic ${authStr}` },
      });

      console.log(`✅ Account deletion request for ${did} to ${server} successful!`);
    } catch (e) {
      console.error(
        `❌ Failed to send account deletion request for ${did} to ${server}:\n\n`,
        e,
      );
      process.exit(1);
    }
  }) as ActionHandler);

import { type ActionHandler, Command } from "@cliffy/command";
import { CredentialManager } from "@atcute/client";
import { XRPC } from "@atcute/client";
import type { GlobalOpts } from "../types";

export const changeHandleCmd = new Command()
  .name("change-handle")
  .option(
    "-d, --did <did:string>",
    "The DID of the account to update",
    {
      required: true,
    },
  )
  .option(
    "-H, --new-handle <newHandle:string>",
    "The updated handle for the account.",
    {
      required: true,
    },
  )
  .description("Update the handle for an account associated with the given PDS.")
  .action((async ({
    server,
    adminPassword,
    did,
    newHandle,
  }: GlobalOpts & { did: string; newHandle: string }) => {
    const manager = new CredentialManager({ service: `${server}` });
    const rpc = new XRPC({ handler: manager });
    const authStr = btoa(`admin:${adminPassword}`);

    try {
      console.log(`🛜 Requesting handle change for ${did} on ${server}...`);

      await rpc.request({
        type: 'post',
        nsid: 'com.atproto.admin.updateAccountHandle',
        data: { did, handle: newHandle },
        headers: { 'Authorization': `Basic ${authStr}` },
      });

      console.log(`✅ Handle change request for ${did} to ${server} successful!`);
      console.log(`   New Handle: ${newHandle}`);
    } catch (e) {
      console.error(
        `❌ Failed to send handle change request for ${did} to ${server}:\n\n`,
        e,
      );
      process.exit(1);
    }
  }) as ActionHandler);

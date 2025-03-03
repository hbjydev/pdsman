import { type ActionHandler, Command } from "@cliffy/command";
import { CredentialManager } from "@atcute/client";
import { XRPC } from "@atcute/client";
import type { GlobalOpts } from "../types";

export const changeEmailCmd = new Command()
  .name("change-email")
  .option(
    "-d, --did <did:string>",
    "The DID of the account to update",
    {
      required: true,
    },
  )
  .option(
    "-e, --email <email:string>",
    "The updated email for the account.",
    {
      required: true,
    },
  )
  .description("Update the email for an account associated with the given PDS.")
  .action((async ({
    server,
    adminPassword,
    did,
    email,
  }: GlobalOpts & { did: string; email: string }) => {
    const manager = new CredentialManager({ service: `${server}` });
    const rpc = new XRPC({ handler: manager });
    const authStr = btoa(`admin:${adminPassword}`);

    try {
      console.log(`🛜 Requesting handle change for ${did} on ${server}...`);

      await rpc.request({
        type: 'post',
        nsid: 'com.atproto.admin.updateAccountEmail',
        data: { did, email },
        headers: { 'Authorization': `Basic ${authStr}` },
      });

      console.log(`✅ Email change request for ${did} to ${server} successful!`);
      console.log(`   New email: ${email}`);
    } catch (e) {
      console.error(
        `❌ Failed to send email change request for ${did} to ${server}:\n\n`,
        e,
      );
      process.exit(1);
    }
  }) as ActionHandler);

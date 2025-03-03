import { type ActionHandler, Command } from "@cliffy/command";
import { CredentialManager } from "@atcute/client";
import { XRPC } from "@atcute/client";
import type { GlobalOpts } from "../types";
import { randomBytes } from 'node:crypto';

export const passwordResetCmd = new Command()
  .name("reset-password")
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
      console.log(`🛜 Requesting password reset for ${did} on ${server}...`);

      const password = randomBytes(16).toString('hex');

      await rpc.request({
        type: 'post',
        nsid: 'com.atproto.admin.updateAccountPassword',
        data: { did, password },
        headers: { 'Authorization': `Basic ${authStr}` },
      });

      console.log(`✅ Password reset for ${did} to ${server} successful!`);
      console.log(`   Password: ${password}`);
    } catch (e) {
      console.error(
        `❌ Failed to send password reset request for ${did} to ${server}:\n\n`,
        e,
      );
      process.exit(1);
    }
  }) as ActionHandler);

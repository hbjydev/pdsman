import { type ActionHandler, Command } from "@cliffy/command";
import { CredentialManager } from "@atcute/client";
import { XRPC, type XRPCResponse } from "@atcute/client";
import type { GlobalOpts } from "../types";
import { randomBytes } from 'node:crypto';

export const createCmd = new Command()
  .name("create")
  .option(
    "-H, --handle <handle:string>",
    "The handle for the new account.",
    {
      required: true,
    },
  )
  .option(
    "-e, --email <email:string>",
    "The email address for the new account.",
    {
      required: true,
    },
  )
  .description("Create an account associated with the given PDS.")
  .action((async ({
    server,
    adminPassword,
    email,
    handle,
  }: GlobalOpts & { email: string; handle: string }) => {
    const manager = new CredentialManager({ service: `${server}` });
    const rpc = new XRPC({ handler: manager });
    const authStr = btoa(`admin:${adminPassword}`);

    try {
      console.log(`🛜 Requesting account creation on ${server}...`);

      const password = randomBytes(16).toString('hex');
      const { data: { code: inviteCode } } = await rpc.request({
        type: 'post',
        nsid: 'com.atproto.server.createInviteCode',
        data: { useCount: 1 },
        headers: { 'Authorization': `Basic ${authStr}` },
      }) as XRPCResponse<{ code: string }>;

      const res = await rpc.request({
        type: 'post',
        nsid: 'com.atproto.server.createAccount',
        data: { email, handle, password, inviteCode },
        headers: { 'Authorization': `Basic ${authStr}` },
      }) as XRPCResponse<{
        handle: string;
        did: `did:${string}`;
      }>;

      console.log(`✅ Account creation request to ${server} successful!`);
      console.log(`   DID:      ${res.data.did}`);
      console.log(`   Password: ${password}`);
    } catch (e) {
      console.error(
        `❌ Failed to send account creation request to ${server}:\n\n`,
        e,
      );
      process.exit(1);
    }
  }) as ActionHandler);

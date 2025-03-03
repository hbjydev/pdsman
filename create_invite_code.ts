import { type ActionHandler, Command } from "@cliffy/command";
import { XRPC, CredentialManager, type XRPCResponse } from "@atcute/client";
import type { GlobalOpts } from "./types.ts";
import { colors } from "@cliffy/ansi/colors";

export const createInviteCodeCmd = new Command()
  .name("create-invite-code")
  .description("Request an invite code from your PDS.")
  .option("-u, --uses <uses:number>", "The number of uses the invite code is valid for", { default: 1 })
  .action((async ({ server, adminPassword, uses }: GlobalOpts & { uses: number; }) => {
    console.log(`🛜 Requesting invite code from PDS ${server}...`);
    const manager = new CredentialManager({ service: server });
    const rpc = new XRPC({ handler: manager });
    const authStr = btoa(`admin:${adminPassword}`);

    try {
      const res = await rpc.request({
        type: 'post',
        nsid: 'com.atproto.server.createInviteCode',
        data: { useCount: uses },
        headers: { 'Authorization': `Basic ${authStr}` },
      }) as XRPCResponse<{ code: string }>;
      console.log(`✅ Invite code: ${colors.bold.blue(res.data.code)}`);
    } catch(e) {
      console.error(`❌ Failed to request invite code from ${server}:\n\n`, e);
      process.exit(1);
    }
  }) as ActionHandler);

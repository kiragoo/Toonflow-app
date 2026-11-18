import u from "@/utils";
import { Router } from "express";
import { success } from "@/lib/responseFormat";

const router = Router();

export default router.get("/", async (req, res) => {
  u.mcpControl.assertAppRequest(req);
  res.set("Cache-Control", "no-store");
  const session = await u.cloudSession.readCloudSession(req);
  res.json(success({ userId: session?.userId ?? null }));
});

import u from "@/utils";
import { Router } from "express";
import { z } from "zod";
import { validateFields } from "@/lib/middleware";
import { success } from "@/lib/responseFormat";

const fields = {
  userId: z.number().int().positive().max(2147483647),
  accessToken: z.string().trim().min(1).max(4096),
  modelToken: z.string().trim().min(1).max(4096),
};
const schema = z.strictObject(fields);
const router = Router();

export default router.put("/", validateFields(fields), async (req, res) => {
  u.mcpControl.assertAppRequest(req);
  const session = schema.parse(req.body);
  await u.cloudSession.saveCloudSession(req, res, session);
  res.json(success({ userId: session.userId }));
});

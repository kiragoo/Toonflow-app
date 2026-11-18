import u from "@/utils";
import { Router } from "express";
import { z } from "zod";
import { validateFields } from "@/lib/middleware";
import { success } from "@/lib/responseFormat";

const fields = { baseUrl: z.string().trim().min(1).max(2048) };
const schema = z.strictObject(fields);
const router = Router();

export default router.put("/", validateFields(fields), (req, res) => {
  u.mcpControl.assertAppRequest(req);
  const { baseUrl } = schema.parse(req.body);
  u.cloudSession.saveNewApiBaseUrl(u.cloudSession.normalizeNewApiBaseUrl(baseUrl));
  res.json(success({ saved: true }));
});

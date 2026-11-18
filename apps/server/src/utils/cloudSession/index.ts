import { randomBytes } from "node:crypto";
import { dirname, resolve } from "node:path";
import type { Request, Response } from "express";
import { mkdir, readFile, writeAtomic } from "@toonflow/file";
import conf from "@/utils/conf";
import { t } from "@/lib/i18n";

const cookieName = "toonflowCloudSession";
const sessionIdPattern = /^[a-f0-9]{64}$/;

export type CloudSession = {
  userId: number;
  accessToken: string;
  modelToken: string;
};

function sessionDirectory() {
  return resolve(dirname(conf.path), "cloudSessions");
}

function cookieValue(req: Request) {
  const values = (req.get("cookie") ?? "").split(";").map(value => value.trim()).filter(value => value.startsWith(`${cookieName}=`));
  return values.length === 1 ? values[0]!.slice(cookieName.length + 1) : "";
}

function cookieOptions(req: Request) {
  const source = req.get("origin") ?? req.get("referer") ?? "";
  return { httpOnly: true, sameSite: "strict" as const, secure: req.secure || source.startsWith("https://"), path: "/" };
}

function sessionPath(id: string) {
  return resolve(sessionDirectory(), `${id}.json`);
}

function readRecord(content: string): CloudSession | null {
  let parsed: unknown;
  try { parsed = JSON.parse(content); }
  catch { return null; }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const record = parsed as Record<string, unknown>;
  if (!Number.isInteger(record.userId) || Number(record.userId) < 1 || Number(record.userId) > 2147483647) return null;
  if (typeof record.accessToken !== "string" || !record.accessToken || record.accessToken.length > 4096) return null;
  if (typeof record.modelToken !== "string" || !record.modelToken || record.modelToken.length > 4096) return null;
  return { userId: record.userId as number, accessToken: record.accessToken, modelToken: record.modelToken };
}

export async function readCloudSession(req: Request): Promise<CloudSession | null> {
  const id = cookieValue(req);
  if (!sessionIdPattern.test(id)) return null;
  const content = await readFile(sessionPath(id), "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
  return content ? readRecord(content) : null;
}

export async function saveCloudSession(req: Request, res: Response, session: CloudSession) {
  const current = cookieValue(req);
  const id = sessionIdPattern.test(current) ? current : randomBytes(32).toString("hex");
  await mkdir(sessionDirectory(), { recursive: true });
  // ACT: 一个浏览器一份会话文件。退出登录尚未删除旧文件，关闭浏览器后文件会留下，直到后续退出流程清理。
  await writeAtomic(sessionPath(id), JSON.stringify(session), { mode: 0o600 });
  res.cookie(cookieName, id, cookieOptions(req));
}

export function normalizeNewApiBaseUrl(value: string) {
  let url: URL;
  try { url = new URL(value); }
  catch { throw Object.assign(new Error(t`New API 根地址无效`), { status: 400 }); }
  if (url.username || url.password || (url.protocol !== "http:" && url.protocol !== "https:") || url.search || url.hash) {
    throw Object.assign(new Error(t`New API 根地址必须是不含账号、查询参数或锚点的 HTTP(S) 地址`), { status: 400 });
  }
  const pathname = url.pathname.replace(/\/+$/, "");
  return `${url.origin}${pathname}`;
}

export function readNewApiBaseUrl() {
  const value = conf.get("settings", {}).newApiBaseUrl;
  return typeof value === "string" ? value : "";
}

export function saveNewApiBaseUrl(baseUrl: string) {
  const settings = { ...conf.get("settings", {}), newApiBaseUrl: baseUrl };
  conf.set("settings", settings);
}

export function keepNewApiBaseUrl(settings: Record<string, unknown>) {
  const baseUrl = conf.get("settings", {}).newApiBaseUrl;
  delete settings.newApiBaseUrl;
  if (typeof baseUrl === "string" && baseUrl) settings.newApiBaseUrl = baseUrl;
}

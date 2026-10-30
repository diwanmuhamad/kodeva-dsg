import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { cmsSchema, leadRecordSchema, type CmsData, type LeadRecord } from "@/lib/cms/schema";
import { seedCms } from "@/lib/cms/seed";

const dataDir = path.join(process.cwd(), "data");
const cmsPath = path.join(dataDir, "cms.json");
const leadsPath = path.join(dataDir, "leads.json");
const uploadDir = path.join(dataDir, "uploads");

let queue: Promise<unknown> = Promise.resolve();

function withStore<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function replaceFile(target: string, contents: string) {
  await mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.tmp`;
  await writeFile(temporary, contents, "utf8");
  try {
    await rename(temporary, target);
  } catch {
    await rm(target, { force: true });
    await rename(temporary, target);
  }
}

export function readCms(): Promise<CmsData> {
  return withStore(async () => {
    try {
      const raw = await readFile(cmsPath, "utf8");
      return cmsSchema.parse(JSON.parse(raw));
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") throw error;
      try {
        await replaceFile(cmsPath, JSON.stringify(seedCms, null, 2));
      } catch {
        return seedCms;
      }
      return seedCms;
    }
  });
}

export function writeCms(data: CmsData): Promise<void> {
  return withStore(async () => {
    const parsed = cmsSchema.parse(data);
    await replaceFile(cmsPath, JSON.stringify(parsed, null, 2));
  });
}

export function readLeads(): Promise<LeadRecord[]> {
  return withStore(async () => {
    try {
      const raw = await readFile(leadsPath, "utf8");
      const parsed = leadRecordSchema.array().safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : [];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  });
}

export function appendLead(lead: LeadRecord): Promise<void> {
  return withStore(async () => {
    const record = leadRecordSchema.parse(lead);
    let current: LeadRecord[] = [];
    try {
      const raw = await readFile(leadsPath, "utf8");
      const parsed = leadRecordSchema.array().safeParse(JSON.parse(raw));
      current = parsed.success ? parsed.data : [];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    await replaceFile(leadsPath, JSON.stringify([record, ...current], null, 2));
  });
}

export async function saveUpload(file: File): Promise<string> {
  const allowed = new Map([
    ["image/png", "png"],
    ["image/jpeg", "jpg"],
    ["image/webp", "webp"],
  ]);
  const extension = allowed.get(file.type);
  if (!extension) throw new Error("Unggah PNG, JPG, atau WebP.");
  if (file.size > 1_500_000) throw new Error("Ukuran gambar maksimal 1,5 MB.");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, name), bytes);
  return `/media/${name}`;
}

export function uploadPath(name: string): string | null {
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) return null;
  return path.join(uploadDir, name);
}

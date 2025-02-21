import { join } from "path";

// Store files outside of public directory
export const UPLOAD_DIR = join(process.cwd(), "uploads");

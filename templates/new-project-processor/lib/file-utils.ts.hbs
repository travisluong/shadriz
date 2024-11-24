import path from "path";
import fs from "fs";
import crypto from "crypto";

export async function uploadFile({ file, dir }: { file: File; dir: string }) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const randomString = crypto.randomBytes(16).toString("hex"); // yg10jn87m5
  const originalName = path.parse(file.name).name; // test image.png
  const sluggedName = originalName.replace(" ", "-"); // test-image.png
  const fileExt = path.extname(file.name); // .png
  const newFileName = `${sluggedName}-${randomString}${fileExt}`; // test-image-yg10jn87m5.png
  const resolvedPath = path.join(getUploadPathByEnv(), dir, newFileName); // /var/www/uploads/test-image-abcdefghij.png
  const resolvedDirPath = path.dirname(resolvedPath); // /var/www/uploads
  const fileUri = `/${dir}/${newFileName}`; // /testdir/test-image.png
  if (!fs.existsSync(resolvedDirPath)) {
    fs.mkdirSync(resolvedDirPath, { recursive: true });
  }
  fs.writeFileSync(resolvedPath, buffer);
  return fileUri;
}

function getUploadPathByEnv(): string {
  switch (process.env.NODE_ENV) {
    case "development":
      return path.join(process.cwd(), "public/uploads");
    case "production":
      return "/var/www/uploads";
    case "test":
      return path.join(process.cwd(), "public/uploads/test");
    default:
      throw new Error("invalid env for upload path " + process.env.NODE_ENV);
  }
}

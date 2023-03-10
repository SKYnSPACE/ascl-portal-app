import type { NextApiRequest } from "next";
// import mime from "mime";
import { join } from "path";
import formidable from "formidable";
import { mkdir, stat } from "fs/promises";

import cryptoRandomString from 'crypto-random-string';

export const FormidableError = formidable.errors.FormidableError;

export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return await new Promise(async (resolve, reject) => {
    const uploadDir = join(
      process.env.ROOT_DIR || process.cwd(),
      `/public/uploads/seminar`
    );
    
    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(e);
        reject(e);
        return;
      }
    }

    let filename = ""; //  To avoid duplicate upload
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 1024 * 1024 * 200, // 200mb
      uploadDir,
      filename: (name, ext, part) => {
        if (filename !== "") {
          return filename;
        }

        const extension = part.originalFilename.split(".").pop();
        filename = cryptoRandomString({length: 16, type:'url-safe'})+"."+ extension;
        return filename;

        // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        // filename = `${part.name || "unknown"}-${uniqueSuffix}.${
        //   mime.getExtension(part.mimetype || "") || "unknown"
        // }`;
        // return filename;
      },
      // filter: (part) => {
      //   return (
      //     part.name === "media" && (part.mimetype?.includes("image") || false)
      //   );
      // },
    });

    form.parse(req, function (err, fields, files) {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};
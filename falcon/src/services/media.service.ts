import db from "@/db";
import { media } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

export interface FileEsque extends Blob {
  name: string;
  customId?: string;
}

const mediaService = {
  async upload(files: FileEsque[], isPublic: boolean, courseId: string) {
    const utapi = new UTApi();
    const response = await utapi.uploadFiles(files);

    const fileObjs = response.map((res: any) => {
      return {
        name: res.data.name as string,
        url: res.data.url as string,
        key: res.data.key as string,
      };
    });

    let fileMap: { [key: string]: string } = {};
    response.forEach((res: any) => {
      fileMap[res.data.name] = res.data.key;
    });

    fileObjs.forEach(async (mediaObj) => {
      await db.insert(media).values({
        key: mediaObj.key,
        name: mediaObj.name,
        course: courseId,
        url: mediaObj.url,
        isPublic: isPublic,
      });
    });

    const ragFormData = new FormData();

    // Append files to the FormData instance
    files.forEach((file) => {
      ragFormData.append("files", file, fileMap[file.name]);
    });

    const ragResponse = await fetch(
      `${process.env.API_URL}/courses/${courseId}/ingest`,
      {
        method: "POST",
        body: ragFormData,
      }
    );
  },

  async moveTo(id: string, isPublic: boolean) {
    await db.update(media).set({ isPublic: !isPublic }).where(eq(media.id, id));
  },

  async delete(id: string) {
    await db.delete(media).where(eq(media.id, id));
  },

  async getManyByKeys(keys: string[]) {
    const result = await db.query.media.findMany({
      where: inArray(media.key, keys),
    });

    return result;
  },

  async getCourseAccessData(courseId: string) {
    const accessData = await db
      .select({ name: media.name, retrieved: media.retrieved })
      .from(media)
      .where(eq(media.course, courseId))
      .orderBy(desc(media.retrieved));

    return accessData;
  },
};

export default mediaService;

import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

const Semester = {
  spring: 1,
  summer: 2,
  fall: 3,
  winter: 4,
}

function semesterStringToAlias(semester: string) {
  if (!semester) return null;
  if (semester) {
    const year = semester.split(' ')[0];
    const season = semester.split(' ')[1];
    return +(year.toString() + '0' + Semester[season]);
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {


  if (req.method === "POST") {

    const {
      body: { semester, prevSemester },
      session: { user },
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });
    const authority = currentUser.position;
    if (authority < 5) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the semester data." })
    }


    if (prevSemester == null) {
      await client.semester.update({
        where: {
          alias: semesterStringToAlias(semester),
        },
        data: {
          isCurrentSemester: true,
        },
      });
      return res.json({ ok: true, })
    }

    if (semester != prevSemester) {
      await client.semester.update({
        where: {
          alias: semesterStringToAlias(prevSemester),
        },
        data: {
          isCurrentSemester: false,
        },
      });

      await client.semester.update({
        where: {
          alias: semesterStringToAlias(semester),
        },
        data: {
          isCurrentSemester: true,
        },
      });
    }

    res.json({ ok: true, })
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
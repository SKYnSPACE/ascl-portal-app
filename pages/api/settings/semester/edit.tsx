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
      body: { semester, doctors, doctorCandidates, masterCandidates },
      session: { user },
    } = req;

    // console.log(req.body, user);

    const semesterToEdit = await client.semester.findUnique({
      where: {
        alias: semesterStringToAlias(semester),
      },
    });

    if (doctors && doctors !== semesterToEdit?.postDocCount) {
      await client.semester.update({
        where: {
          alias: semesterStringToAlias(semester),
        },
        data: {
          postDocCount: +doctors,
        },
      });
    }

    if (doctorCandidates && doctorCandidates !== semesterToEdit?.phdCandidateCount) {
      await client.semester.update({
        where: {
          alias: semesterStringToAlias(semester),
        },
        data: {
          phdCandidateCount: +doctorCandidates,
        },
      });
    }

    if (masterCandidates && masterCandidates !== semesterToEdit?.msCandidateCount) {
      await client.semester.update({
        where: {
          alias: semesterStringToAlias(semester),
        },
        data: {
          msCandidateCount: +masterCandidates,
        },
      });
    }


    res.json({
      ok: true,
    });

  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
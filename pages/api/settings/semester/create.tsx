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

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  const {
    body: { year, season, doctors, doctorCandidates, masterCandidates },
    session: { user },
  } = req;

  // console.log(req.body, user);

  const newSemester = await client.semester.create({
    data: {
      alias: +(year.toString() + '0' + Semester[season]),
      postDocCount: +doctors,
      phdCandidateCount: +doctorCandidates,
      msCandidateCount: +masterCandidates,
    },
  });

  res.json({
    ok: true,
    newSemester,
  });

  // res.json({ok: true,})
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
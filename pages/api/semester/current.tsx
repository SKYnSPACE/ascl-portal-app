import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const semester = await client.semester.findFirst({
      where: {isCurrentSemester: true}
    });

    // console.log(semester)

    res.json({
      ok: true,
      semester,
    });
  }

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
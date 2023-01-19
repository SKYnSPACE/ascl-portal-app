import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { query:{alias},
    session: { user } } = req;

    // console.log(alias)

    if(!alias) {
      return res.json({ok:false});
    }

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    const authority = currentUser.position;

    if (authority < 5) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the semester data." })
    }

    // console.log(alias)

    const semester = await client.semester.findUnique({
      where: {alias: +alias}
    });

    // console.log(semester)

    res.json({
      ok: true,
      semester,
    });
  }

  if (req.method === "POST") {
    res.json({ ok: false });
  }

  // res.json({ok: true,})
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
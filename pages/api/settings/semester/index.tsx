import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { session: { user } } = req;
    // console.log(req.query)

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    const authority = currentUser.position;

    if (authority < 5) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the semester data." })
    }

    const semesters = await client.semester.findMany({
      select: {
        alias: true,
      }
    });

    // console.log(semesters)

    res.json({
      ok: true,
      semesters,
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
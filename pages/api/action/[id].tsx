import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { query: { id },
      session: { user } } = req;

    if (!id) {
      return res.json({ ok: false });
    }

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });
    const authority = currentUser.position;
    if (authority < 2) {
      return res.status(403).json({
        ok: false,
        error: { code: 403, message: "Not allowed to access the selected project." }
      })
    }

    const relatedAction = await client.action.findUnique({
      where: {
        id: +id,
      },
    })

    res.json({
      ok: true,
      relatedAction
    });
  }

  if (req.method === "POST") {
    res.json({ ok: false });
  }

}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
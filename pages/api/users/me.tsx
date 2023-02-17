import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const user = await client.user.findUnique({
      where: { id: req.session.user?.id },
      include: {
        requests: {
          where: {
            status: 0,
          },
          select: {
            id: true,
            kind: true,
            payload1: true,
            payload2: true,
            payload6: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      }
    });

    res.json({
      ok: true,
      user,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
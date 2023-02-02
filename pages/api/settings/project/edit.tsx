import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const currentProjects = await client.project.findMany({
      where: {
        isFinished: {
          not: true,
        },
      },
      orderBy: [{ alias: 'asc' }],
    })

    res.json({
      ok: true,
      currentProjects,
    });
  }

  if (req.method === "POST") {
    res.json({
      ok: true,
    });
  }


}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
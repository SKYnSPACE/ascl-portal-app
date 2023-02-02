import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const projects = await client.project.findMany({
      where: {
        isFinished: {
          not: true,
        },
      },
      orderBy: [{ alias: 'asc' }],
      
      select: {
        title: true,
        alias: true,
        type: true,
        
        startDate: true,
        endDate: true,
        teamInCharge: true,
        scale: true,

        note: true,

        managers: {
          select: {
            user: {
              select: {
                name: true,
              }
            },
          },
        },
        staffs: {
          select: {
            user: {
              select: {
                name: true,
              }
            },
          },
        },
        participants: {
          select: {
            user: {
              select: {
                name: true,
              }
            },
          },
        },
      },
    })

    res.json({
      ok: true,
      projects,
    });
  }

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
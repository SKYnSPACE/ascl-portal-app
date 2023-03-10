import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const {
      session: { user }
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });
    const authority = currentUser.position;
    if (authority < 2) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the data." })
    }

//TODO: Show only related projects
//TODO: (prof. sec. Lab manager: all / team Leader: all )
    const projects = await client.project.findMany({
      where: {
        NOT:{
          isFinished: true,
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

        mpeExeRate:true,
        cpeExeRate:true,
        dteExeRate:true,
        oteExeRate:true,
        meExeRate:true,
        aeExeRate:true,
        

        managers: {
          select: {
            user: {
              select: {
                name: true,
                userNumber: true,
              }
            },
          },
        },
        staffs: {
          select: {
            user: {
              select: {
                name: true,
                userNumber: true,
              }
            },
          },
        },
        participants: {
          select: {
            user: {
              select: {
                name: true,
                userNumber: true,
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
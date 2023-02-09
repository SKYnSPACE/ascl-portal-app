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

    let editableProjects = [];
    if (authority >= 3) {
      editableProjects = await client.project.findMany({
        where: {
          NOT: {
            isFinished: true,
          },
          AND: [
            {
              managers: {
                none: {
                  user: {
                    id: +user.id,
                  }
                }
              }
            },
            {
              staffs: {
                none: {
                  user: {
                    id: +user.id,
                  }
                }
              }
            },
            {
              participants: {
                none: {
                  user: {
                    id: +user.id,
                  }
                }
              }
            },
          ],
        },
        orderBy: [{ alias: 'asc' }],

        select: {
          title: true,
          alias: true,
          teamInCharge: true,
        },
      })
    }

    const managingProjects = await client.project.findMany({
      where: {
        NOT: {
          isFinished: true,
        },
        managers: {
          some: {
            user: {
              id: +user.id,
            }
          }
        }
      },
      orderBy: [{ alias: 'asc' }],
      select: {
        title: true,
        alias: true,
        teamInCharge: true,
      },
    })

    const staffingProjects = await client.project.findMany({
      where: {
        NOT: {
          isFinished: true,
        },
        staffs: {
          some: {
            user: {
              id: +user.id,
            }
          }
        }
      },
      orderBy: [{ alias: 'asc' }],
      select: {
        title: true,
        alias: true,
        teamInCharge: true,
      },
    })

    const participatingProjects = await client.project.findMany({
      where: {
        NOT: {
          isFinished: true,
        },
        participants: {
          some: {
            user: {
              id: +user.id,
            }
          }
        }
      },
      orderBy: [{ alias: 'asc' }],
      select: {
        title: true,
        alias: true,
        teamInCharge: true,
      },
    })

    res.json({
      ok: true,
      managingProjects,
      staffingProjects,
      participatingProjects,
      editableProjects,
    });
  }

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
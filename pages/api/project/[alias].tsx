import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { query: { alias },
      session: { user } } = req;

    if (!alias) {
      return res.json({ ok: false });
    }

    //TODO: Restrict user if not participating.
    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });
    const authority = currentUser.position;
    if (authority < 2) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the data." })
    }

    const selectedProject = await client.project.findUnique({
      where: {
        alias: alias.toString()
      },

      include: {
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

    //TODO: Restrict user if not participating.
    if (
      !selectedProject?.managers?.find((manager) => +manager.user.userNumber === +currentUser.userNumber)
      && !selectedProject?.staffs?.find((staff) => +staff.user.userNumber === +currentUser.userNumber)
      && !selectedProject?.participants?.find((participant) => +participant.user.userNumber === +currentUser.userNumber)
      && authority < 3
    )
      return res.status(403).json({ ok: false, 
        error: {code:403, message:"Not allowed to access the selected project."}
      })


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



    //TODO: Return ledger
    res.json({
      ok: true,
      selectedProject,
      managingProjects,
      staffingProjects,
      participatingProjects,
      editableProjects,
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
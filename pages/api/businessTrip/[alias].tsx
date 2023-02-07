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
      query: { alias },
      session: { user }
    } = req;

    console.log(alias)

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });
    const authority = currentUser.position;
    if (authority < 2) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the data." })
    }


    const selectedProject = await client.project.findUnique({
      where: {
        alias: alias?.toString(),
      },
      select: {
        id: true,
        dteBalance: true,
        oteBalance: true,
      }
    })


    if (authority >= 6) {
      const myProjects = await client.project.findMany({
        where: {
          NOT: {
            isFinished: true,
          },
        },
        orderBy: [{ alias: 'asc' }],

        select: {
          title: true,
          alias: true,
        },
      })

      let managers = [];
      if (selectedProject)
        managers = await client.user.findMany({
          where: {
            managingProjects: {
              some: {
                projectId: +selectedProject?.id
              }
            }
          }
        })

      const directors = await client.user.findMany({
        where: {
          position: {
            gte: 3,
            lte: 7,
          },
        },
        orderBy: [{
          position: 'asc',
        },
        {
          userNumber: 'desc',
        }]
      })

      // const approval = await client.user.findMany({
      //   where: {
      //     OR: [{
      //       position: {
      //         gte: 3,
      //         lte: 7,
      //       },
      //     },
      //     {
      //       managingProjects: {
      //         some: {
      //           projectId: +selectedProject?.id
      //         }
      //       }
      //     }
      //     ],
      //   }
      // })

      res.json({
        ok: true,
        myProjects,
        selectedProject,
        managers,
        directors,
      });
    }
    else {
      const myProjects = await client.project.findMany({
        where: {
          NOT: {
            isFinished: true,
          },
          OR: [
            {
              managers: {
                some: {
                  user: {
                    id: +user.id,
                  }
                }
              }
            },
            {
              staffs: {
                some: {
                  user: {
                    id: +user.id,
                  }
                }
              }
            },
            {
              participants: {
                some: {
                  user: {
                    id: +user.id,
                  }
                }
              }
            },
          ]
        },
        orderBy: [{ alias: 'asc' }],

        select: {
          title: true,
          alias: true,
        },
      })

      
      let managers = [];
      if (selectedProject)
        managers = await client.user.findMany({
          where: {
            managingProjects: {
              some: {
                projectId: +selectedProject?.id
              }
            }
          }
        })

      const directors = await client.user.findMany({
        where: {
          position: {
            gte: 3,
            lte: 7,
          },
        },
        orderBy: [{
          position: 'asc',
        },
        {
          userNumber: 'desc',
        }]
      })

      res.json({
        ok: true,
        myProjects,
        selectedProject,
        managers,
        directors,
      });
    }
  }

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
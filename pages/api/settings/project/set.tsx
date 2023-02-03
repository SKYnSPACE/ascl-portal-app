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
      select: {
        id: true,
        title: true,
        alias: true,
        managers: {
          select: {
            user: {
              select: {
                name: true,
                userNumber: true,
              },
            },
            userId: true,
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
            userId: true
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
            userId: true
          },
        },
        isFinished: true,
      },
      orderBy: [{ alias: 'asc' }],
    })

    const researchers = await client.user.findMany({
      where: {
        position: {
          gte: 2,
          // lt: 6,
        }
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: [{ userNumber: 'asc' }],
    })

    res.json({
      ok: true,
      currentProjects,
      researchers
    });
  }

  if (req.method === "POST") {

    const {
      body: { projectAlias, userId, manager, staff, participant, isFinished },
      session: { user },
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    const userToEdit = await client.user.findUnique({
      where: {
        id: +userId,
      }
    })

    const authority = currentUser.position;

    const previousData = await client.project.findUnique({
      where: {
        alias: projectAlias,
      },
      select: {
        id: true,
        title: true,
        alias: true,
        managers: {
          select: {
            user: {
              select: {
                name: true,
              }
            },
            userId: true
          },
        },
        staffs: {
          select: {
            user: {
              select: {
                name: true,
              }
            },
            userId: true
          },
        },
        participants: {
          select: {
            user: {
              select: {
                name: true,
              }
            },
            userId: true
          },
        },
        isFinished: true,
      },
    });

    //TODO: get manager info from previous data.
    const isCurrentUserManager = !!previousData?.managers?.find(manager => manager.userId === +currentUser.id);

    const isManager = !!previousData?.managers?.find(manager => manager.userId === +userToEdit.id);
    const isStaff = !!previousData?.staffs?.find(staff => staff.userId === +userToEdit.id);
    const isParticipant = !!previousData?.participants?.find(participant => participant.userId === +userToEdit.id);

    if (authority >= 4 || isCurrentUserManager) {
      if (isFinished) {
        const updatedData = await client.project.update({
          where: {
            id: +previousData.id,
          },
          data: {
            isFinished,
          },
        })

        return res.json({
          ok: true,
          updatedData
        });
      }

      if (manager ^ (isManager ? 1 : 0)) { //Want to modify record?
        if (isManager) { //Previously manager?
          const tableToDelete = await client.managingProjectsTable.deleteMany({
            where:{
              userId: userToEdit.id, 
              projectId: previousData.id,
            }
          })

          return res.json({
            ok: true,
            tableToDelete,
          });

        }
        else { //Previously not manager?
          const updatedData = await client.project.update({
            where: {
              id: +previousData.id,
            },
            data: {
              managers: {
                create: [{
                  user: {
                    connect: {
                      id: userToEdit?.id,
                    }
                  },
                }],
              },
            }
          })
          return res.json({
            ok: true,
            updatedData,
          });
        }
      }

      else if (staff ^ (isStaff ? 1 : 0)) {
        if (isStaff) { //Previously staff?
          const tableToDelete = await client.staffingProjectsTable.deleteMany({
            where:{
              userId: userToEdit.id, 
              projectId: previousData.id,
            }
          })

          return res.json({
            ok: true,
            tableToDelete,
          });

        }
        else { //Previously not staff?
          const updatedData = await client.project.update({
            where: {
              id: +previousData.id,
            },
            data: {
              staffs: {
                create: [{
                  user: {
                    connect: {
                      id: userToEdit?.id,
                    }
                  },
                }],
              },
            }
          })
          return res.json({
            ok: true,
            updatedData,
          });
        }
      }

      else if (participant ^ (isParticipant ? 1 : 0)) {
        if (isParticipant) { //Previously participant?
          const tableToDelete = await client.participatingProjectsTable.deleteMany({
            where:{
              userId: userToEdit.id, 
              projectId: previousData.id,
            }
          })

          return res.json({
            ok: true,
            tableToDelete,
          });

        }
        else { //Previously not participant?
          const updatedData = await client.project.update({
            where: {
              id: +previousData.id,
            },
            data: {
              participants: {
                create: [{
                  user: {
                    connect: {
                      id: userToEdit?.id,
                    }
                  },
                }],
              },
            }
          })
          return res.json({
            ok: true,
            updatedData,
          });
        }
      }


      res.json({
        ok: true,
        message: 'Nothing to change.',
      });
    }
    else {
      return res.status(403).json({ ok: false, error: { code: "403", message: "Not allowed to edit this project." } })
    }
  }

}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

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

    if (
      !selectedProject?.managers?.find((manager) => +manager.user.userNumber === +currentUser.userNumber)
      && !selectedProject?.staffs?.find((staff) => +staff.user.userNumber === +currentUser.userNumber)
      && !selectedProject?.participants?.find((participant) => +participant.user.userNumber === +currentUser.userNumber)
      && authority < 3
    )
      return res.status(403).json({
        ok: false,
        error: { code: 403, message: "Not allowed to access the selected project." }
      })

    const transactions = await client.action.findMany({
      where:{
        kind: 35,
        payload5: "DTE",
        status:{
          gte: 1,
        }
      },
      include:{
        relatedRequest:{
          select:{
            payload2: true,
          }
        }
      }
    })

    //TODO: Return ledger
    res.json({
      ok: true,
      transactions
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
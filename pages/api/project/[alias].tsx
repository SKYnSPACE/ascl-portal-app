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

    const projectInfo = await client.project.findUnique({
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
      !projectInfo?.managers?.find((manager) => +manager.user.userNumber === +currentUser.userNumber)
      && !projectInfo?.staffs?.find((staff) => +staff.user.userNumber === +currentUser.userNumber)
      && !projectInfo?.participants?.find((participant) => +participant.user.userNumber === +currentUser.userNumber)
      && authority < 3
    )
      return res.status(403).json({ ok: false, error: "Not allowed to access the data." })




    //TODO: Return ledger
    res.json({
      ok: true,
      projectInfo,
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
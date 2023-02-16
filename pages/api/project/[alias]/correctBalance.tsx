import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

const CategoryCode = {
  'MPE': 30,
  'CPE': 30,
  'DTE': 35,
  'OTE': 35,
  'ME': 30,
  'AE': 30,
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {
    res.json({ ok: false });
  }

  if (req.method === "POST") {

    const { query: { alias },
      body:{note, variance, category},
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
      },
    })

    if (
      !selectedProject?.managers?.find((manager) => +manager.user.userNumber === +currentUser.userNumber)
      && authority < 3
    )
      return res.status(403).json({
        ok: false,
        error: { code: 403, message: "Not allowed to change the selected project." }
      })



//TODO: 카테고리별로 프로젝트 balance 업데이트!!!!!!!!!!!!!!!!!!!!!!!!!!


    const correction = await client.action.create({
      data:{
        kind: +CategoryCode[category],
        payload1: currentUser.id?.toString(),
        payload2: currentUser.name?.toString(),
        payload5: category?.toString(),
        payload6: note?.toString(),
        payload7: variance?.toString(),
        status: 1,
        due: new Date(),
        completedAt: new Date(),
      },
    })

    //TODO: Return ledger
    res.json({
      ok: true,
      correction
    });
  }



}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
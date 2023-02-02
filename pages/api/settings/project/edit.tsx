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

    const {
      body: { projectAlias,
        title, alias, type,
        startDate, endDate,
        scale, teamInCharge,
        mpePlanned, cpePlanned, dtePlanned, otePlanned, mePlanned, aePlanned,
        note },
      session: { user },
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    const authority = currentUser.position;

    const previousData = await client.project.findUnique({
      where: {
        alias: projectAlias,
      }
    });

//TODO: get manager info from previous data.
const isManager = false;

    if (authority >= 4 || isManager) {
      const newBalance = {
        mpeBalance: (previousData?.mpeBalance || 0) + (mpePlanned - (previousData?.mpePlanned || 0)),
        cpeBalance: (previousData?.cpeBalance || 0) + (cpePlanned - (previousData?.cpePlanned || 0)),
        dteBalance: (previousData?.dteBalance || 0) + (dtePlanned - (previousData?.dtePlanned || 0)),
        oteBalance: (previousData?.oteBalance || 0) + (otePlanned - (previousData?.otePlanned || 0)),
        meBalance: (previousData?.meBalance || 0) + (mePlanned - (previousData?.mePlanned || 0)),
        aeBalance: (previousData?.aeBalance || 0) + (aePlanned - (previousData?.aePlanned || 0)),
      };

      const updatedData = await client.project.update({
        where: {
          id: +previousData.id,
        },
        data: {

          title,
          alias,
          type,
          startDate,
          endDate,
          scale: +scale,
          teamInCharge,
          mpePlanned,
          cpePlanned,
          dtePlanned,
          otePlanned,
          mePlanned,
          aePlanned,
          ...newBalance,
          note,
        },
      })

      res.json({
        ok: true,
        updatedData
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
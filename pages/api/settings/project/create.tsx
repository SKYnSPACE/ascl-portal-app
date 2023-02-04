import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  const {
    body: { title,
      alias, type,
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

  if (authority >= 2) {

    const newProject = await client.project.create({
      data: {

        title,
        alias,
        type,
        startDate,
        endDate,
        scale: +scale,
        teamInCharge,
        mpePlanned,
        mpeBalance: mpePlanned,
        mpeExeRate: 0,
        cpePlanned,
        cpeBalance: cpePlanned,
        cpeExeRate: 0,
        dtePlanned,
        dteBalance: dtePlanned,
        dteExeRate: 0,
        otePlanned,
        oteBalance: otePlanned,
        oteExeRate: 0,
        mePlanned,
        meBalance: mePlanned,
        meExeRate: 0,
        aePlanned,
        aeBalance: aePlanned,
        aeExeRate: 0,
        note,

        managers: {
          create: [{
            user: {
              connect: {
                id: currentUser?.id,
              }
            },
          }],
        },

      },
    });

    console.log(newProject)

    res.json({
      ok: true,
      newProject,
    });

  }
  else {
    return res.status(403).json({ ok: false, error: { code: "403", message: "Not allowed to create new project." } })
  }

  // res.json({ok: true,})
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
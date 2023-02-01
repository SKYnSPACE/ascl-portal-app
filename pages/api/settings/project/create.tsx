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
      note},
    session: { user },
  } = req;

  const currentSemester = await client.semester.findFirst({
    where: {
      isCurrentSemester: true,
    }
  });

  const currentUser = await client.user.findUnique({
    where: { id: user.id },
  });
  const authority = currentUser.position;

  if (authority >= 2) {
    
    const newSlot = await client.project.create({
      data: {

        title,
        alias,
        type,
        startDate,
        endDate,
        scale,
        teamInCharge,
        mpePlanned,
        mpeBalance: mpePlanned,
        cpePlanned,
        cpeBalance: cpePlanned,
        dtePlanned,
        dteBalance: dtePlanned,
        otePlanned,
        oteBalance: otePlanned,
        mePlanned,
        meBalance: mePlanned,
        aePlanned,
        aeBalance: aePlanned,
        note,

        semester: {
          connect: {
            id: currentSemester?.id
          },
        },

      },
    });

    res.json({
      ok: true,
      newSlot,
    });

  }
  else {
    return res.status(403).json({ ok: false, error: {code: "403", message:"Not allowed to create new project." }})
  }

  // res.json({ok: true,})
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

const Duties = {
  seminar: 0b10000000,
  publications: 0b01000000,

  server: 0b00010000,
  computer: 0b00001000,

  safety: 0b00000010,
  news: 0b00000001,
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  const {
    body: { semester, date, startsAt, endsAt, isBreak, note },
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
  const duties = currentUser.duties;

  if (authority >= 5 || (duties & Duties.seminar)) {
    
    const newSlot = await client.seminarslot.create({
      data: {

        date,
        startsAt,
        endsAt,
      
        isBreak,
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
    return res.status(403).json({ ok: false, error: "Not allowed to create seminar slots." })
  }

  // res.json({ok: true,})
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
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

  if (req.method === "POST") {
    const {
      body: { slotId, startsAt, endsAt, isBreak, note },
      session: { user },
    } = req;


    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });
    const authority = currentUser.position;
    const duties = currentUser.duties;

    if (authority >= 5 || (duties & Duties.seminar)) {

      const slotToEdit = await client.seminarslot.findUnique({
        where: {
          id: +slotId,
        },
      });

      if (startsAt && startsAt !== slotToEdit?.startsAt) {
        await client.seminarslot.update({
          where: {
            id: +slotId,
          },
          data: {
            startsAt,
          },
        });
      }

      if (endsAt && endsAt !== slotToEdit?.endsAt) {
        await client.seminarslot.update({
          where: {
            id: +slotId,
          },
          data: {
            endsAt,
          },
        });
      }

      if ((isBreak == true || isBreak == false) && isBreak !== slotToEdit?.isBreak) {
        await client.seminarslot.update({
          where: {
            id: +slotId,
          },
          data: {
            isBreak,
          },
        });

      }

      if (note && note !== slotToEdit?.note) {
        await client.seminarslot.update({
          where: {
            id: +slotId,
          },
          data: {
            note,
          },
        });
      }
    }
    else {
      return res.status(403).json({ ok: false, error: "Not allowed to edit seminar slots." })
    }

    res.json({
      ok: true,
    });

  }

  if (req.method === "DELETE") {
    const {
      body: { slotId },
      session: { user },
    } = req;


    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });
    const authority = currentUser.position;
    const duties = currentUser.duties;

    if (authority >= 5 || (duties & Duties.seminar)) {

      const deleteSlot = await client.seminarslot.delete({
        where: {
          id: +slotId,
        },
      });

      console.log(deleteSlot)

    }
    else {
      return res.status(403).json({ ok: false, error: "Not allowed to edit seminar slots." })
    }

    res.json({
      ok: true,
    });

  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "DELETE"],
    handler,
  })
);
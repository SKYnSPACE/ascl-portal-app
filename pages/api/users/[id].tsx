import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

const Duties = {
  seminar: 0b10000000,
  publications: 0b01000000,

  server: 0b00010000,
  computer: 0b00001000,

  safety: 0b00000010,
  news: 0b00000001,
}

function exclude<Seminar, Key extends keyof Seminar>(
  seminar: Seminar,
  keys: Key[]
): Omit<Seminar, Key> {
  for (let key of keys) {
    delete seminar[key]
  }
  return seminar
}


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const {
      query: { id },
      session: { user }
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    if (currentUser.position < 2) {
      return res.status(403).json({ ok: false, error: { code: "403", message: "Not allowed access the data." } });//Not allowed to.
    }

    const selectedUser = await client.user.findUnique({
      where: {
        id: +id
      },
      select: {
        id: true,
        avatar: true
      }
    })

    return res.json({
      ok: true,
      selectedUser
    });
  }

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
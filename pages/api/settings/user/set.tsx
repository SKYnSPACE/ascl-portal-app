import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {


  if (req.method === "POST") {
    const {
      body: { position, duties, id },
      session: { user }, //TODO: LOG the user who edited profiles.
    } = req;

    const userToEdit = await client.user.findUnique({
      where: {
        id: id,
      },
    });

    if (position && (+position.toString() !== userToEdit?.position)) {
      await client.user.update({
        where: {
          id: id,
        },
        data: {
          position: +position.toString(),
        },
      });
    }

    if (+duties?.toString() !== userToEdit?.duties) {
      await client.user.update({
        where: {
          id: id,
        },
        data: {
          duties: +duties.toString(),
        },
      });
    }

    res.json({ ok: true, })
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
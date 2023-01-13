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
      body: { firstName, lastName },
      session: { user }, //TODO: LOG the user who edited profiles.
    } = req;

    const userToEdit = await client.user.findUnique({
      where: {
        id: user.id,
      },
    });

    const newName = firstName + " " + lastName;

    if (newName && newName !== userToEdit?.name) {
      await client.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: newName,
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
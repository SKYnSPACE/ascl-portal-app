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
      body: { userNumber, email, phone, id },
      session: { user }, //TODO: LOG the user who edited profiles.
    } = req;

    const userToEdit = await client.user.findUnique({
      where: {
        id: id,
      },
    });

    if (userNumber && userNumber !== userToEdit?.userNumber) {
      await client.user.update({
        where: {
          id: id,
        },
        data: {
          userNumber: +userNumber.toString(),
        },
      });
    }

    if (email && email !== userToEdit?.email) {
      await client.user.update({
        where: {
          id: id,
        },
        data: {
          email,
        },
      });
    }

    if (phone && phone !== userToEdit?.phone) {
      await client.user.update({
        where: {
          id: id,
        },
        data: {
          phone,
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
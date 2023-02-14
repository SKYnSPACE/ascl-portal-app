import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {


  if (req.method === "POST") {

    const {
      body: { alias, finalFile },
      session: { user },
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user?.id },
    });

    const currentSeminar = await client.seminar.findUnique({
      where: { alias: alias?.toString(), },
      include: {
        slot: true,
      }
    });

    if (currentUser.id != currentSeminar.presentedById) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the seminar data." })
    }


    const newfinalFilename = finalFile?.name + '.' + finalFile?.ext;
    if (finalFile && newfinalFilename !== currentSeminar?.finalFile) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          finalFile: newfinalFilename,
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
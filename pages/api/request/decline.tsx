import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  let dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);

  const {
    body: { requestId },
    session: { user }
  } = req;

  const currentUser = await client.user.findUnique({
    where: { id: user.id },
  });

  const currentRequest = await client.request.findUnique({
    where: { id: +requestId },
  });

  if (currentUser.id != currentRequest.userId)
    return res.status(403).json({ ok: false, error: "Not allowed to." });
  

  const declined = await client.request.update({
    where: {
      id: +requestId,
    },
    data: {
      status: -1,
    },
  });


  res.json({
    ok: true,
    declined,
  });
}


export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
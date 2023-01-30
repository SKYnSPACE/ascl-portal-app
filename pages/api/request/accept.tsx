import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

import { postMail } from "../../../libs/backend/postMail";

const Requests = {
  seminar: 90,
}

const getRequestString = (kind:number) => {
  switch (kind) {
    case Requests.seminar:
      return "Seminar Review";
    default: return "";
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

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

  const requestedUser = await client.user.findUnique({
    where: { id: +currentRequest.payload1 }
  })

  if (currentUser.id != currentRequest.userId)
    return res.status(403).json({ ok: false, error: "Not allowed to." });
  

  const accepted = await client.request.update({
    where: {
      id: +requestId,
    },
    data: {
      status: 1,
    },
  });

  postMail(
    `${requestedUser.email}`,
    `${currentUser.name.toString()} accepted your [${getRequestString(currentRequest.kind)}] request.`,
    "Request accepted. Please check the details from the ASCL Portal.",
    `<p>Your [${getRequestString(currentRequest.kind)}] request to [${currentUser.name.toString()}] has been accepted. <br /> 
    Please check the details from the ASCL Portal.</p>`,
    false);

  res.json({
    ok: true,
    accepted,
  });
}


export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
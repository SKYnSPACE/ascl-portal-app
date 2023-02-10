import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

import { postMail } from "../../../libs/backend/postMail";

const Requests = {
  seminar: 90,
}

const getRequestString = (kind: number) => {
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
    body: { requestId, message, notify },
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


  let dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const declined = await client.request.update({
    where: {
      id: +requestId,
    },
    data: {
      status: -1,
      payload11: message?.toString(),
      due: dueDate,
    },
  });

  if (notify)
    postMail(
      `${requestedUser.email}`,
      `${currentUser.name.toString()} declined your [${getRequestString(currentRequest.kind)}] request.`,
      "Request declined. Please check the details from the ASCL Portal.",
      `<p>Your <b>${getRequestString(currentRequest.kind)}</b> request to <b>${currentUser.name.toString()}</b> (${currentUser.email.toString()}) has been declined. <br /> 
    Please check the details from the ASCL Portal.</p>
    <p><b>Message:</b> ${message?.toString()}</p>`,
      false);

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
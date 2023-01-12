import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  const {
    body: { userNumber, email, phone, firstName, lastName },
    session: { user },
  } = req;

  // console.log(req.body, user);

  const newUser = await client.user.create({
    data: {
      userNumber: +userNumber,
      email, 
      phone, 
      name: firstName + " " + lastName,
    },
  });
  res.json({
    ok: true,
    newUser,
  });

  // res.json({ok: true,})
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
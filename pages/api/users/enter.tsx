import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";

import nodemailer from "nodemailer";
import { postMail } from "../../../libs/backend/postMail";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<void> {
  const { email } = req.body;
  const user = email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connect: {
          ...user
        },
      },
    },
  });


  postMail(email,
    'Login Info', 
    `Your OTP: ${payload}. Do not reply to this email address. Ask Lab manager if you have any issues.`,
    `<p>Your OTP: <b>${payload}</b></p> <p>Do not reply to this email address. Ask Lab manager if you have any issues.</p>`
  );


  return res.json({
    ok: true,
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });

// export default async function handler(req: NextApiRequest, res: NextApiResponse)
// {
//   console.log(req.body.email);
//   res.status(200).end();
// }
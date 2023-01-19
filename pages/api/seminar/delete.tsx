import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

import fs from 'fs';
import { join } from "path";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {


  const { query: { token, ext } } = req;
  console.log(token, ext)

  const filepath = join(process.cwd(), `/public/uploads/seminar/${token}.${ext}`);
  fs.access(filepath,
    fs.constants.F_OK, (err) => {
      if (err) return console.log("Cannot remove.")
    });

  fs.unlink(filepath, (err) => { err ?
    console.log(err) : console.log("File removed.")
  });

  res.json({ ok: true, })

}

export default withApiSession(
  withHandler({
    methods: ["DELETE"],
    handler,
  })
);
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { session: {user}} = req;
    
    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    const authority = currentUser.position;

    const users = await client.user.findMany({
      where:{
        position:{
          lte: authority,
        }
      }
    });
    // console.log(users)
    res.json({
      ok: true,
      users,
    });
  }

  if (req.method === "POST"){
    res.json({ok:false});
  }

  // res.json({ok: true,})
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
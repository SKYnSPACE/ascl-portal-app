import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { query:{alias},
    session: { user } } = req;

    // console.log(alias)

    if(!alias) {
      return res.json({ok:false});
    }

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    // TODO: 세미나 정보 접근권한 확인 (리뷰어이거나, 총무, 교수, 세미나담당자여야 함.)
    if (false) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the data." })
    }


    const seminar = await client.seminar.findUnique({
      where: {alias: alias.toString()},
      include:{
        presentedBy:{
          select:{
            name:true,
          }
        }
      }
    });

    // console.log(semester)

    res.json({
      ok: true,
      seminar,
    });
  }

  if (req.method === "POST") {
    res.json({ ok: false });
  }

  // res.json({ok: true,})
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);